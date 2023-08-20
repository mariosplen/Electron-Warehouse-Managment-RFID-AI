import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import {renderBoxes} from "./renderBox";
import labels from "./labels.json";

const numClass = labels.length;


export const runModelLoop = (cameraRef, model, canvasRef, modelsLoopToggleRef) => {

    const detectFrame = async () => {

        if (!modelsLoopToggleRef.current) {
            const ctx = canvasRef.getContext("2d");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
            return;
        }

        runModels(cameraRef, model, canvasRef, () => {
            requestAnimationFrame(detectFrame);
        });
    };

    detectFrame();
};


export const runModels = async (source, model, canvasRef, loadNextFrameIfNotStopped = () => {
}) => {

    // Start tf engine scoping
    tf.engine().startScope();

    // Run object detection
    const [boxes, scores, classes, xRatio, yRatio, res, transRes] = runObjectDetection(source, model);

    // Apply NMS
    const [boxes_data, scores_data, classes_data, nms] = await applyNMS(boxes, scores, classes);

    // Render boxes
    renderBoxes(canvasRef, boxes_data, scores_data, classes_data, [xRatio, yRatio], 1, 1); // render boxes


    // Clear memory
    tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory

    // Run loadNextFrameIfNotStopped, to run next frame with requestAnimationFrame
    loadNextFrameIfNotStopped();

    // End tf engine scoping
    tf.engine().endScope();
};

const runObjectDetection = (source, model) => {
    // Get model width and height
    const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);

    // Preprocess image
    const [input, xRatio, yRatio] = preprocess(source, modelWidth, modelHeight);

    // Run model
    const res = model.net.execute(input);
    // Transpose result [b, det, n] => [b, n, det]
    const transRes = res.transpose([0, 2, 1]);
    const boxes = tf.tidy(() => {
        const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
        const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
        const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
        const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
        return tf
            .concat(
                [
                    y1,
                    x1,
                    tf.add(y1, h), //y2
                    tf.add(x1, w), //x2
                ],
                2
            )
            .squeeze();
    }); // process boxes [y1, x1, y2, x2]

    const [scores, classes] = tf.tidy(() => {
        // class scores
        const rawScores = transRes.slice([0, 0, 4], [-1, -1, numClass]).squeeze(0); // Only squeeze axis 0 to handle only 1 class models
        return [rawScores.max(1), rawScores.argMax(1)];
    }); // get max scores and classes index

    return [boxes, scores, classes, xRatio, yRatio, res, transRes];
}

const applyNMS = async (boxes, scores, classes, maxOutputSize = 500, iouThreshold = 0.45, scoreThreshold = 0.2) => {
    const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold); // NMS to filter boxes

    const boxes_data = boxes.gather(nms, 0).dataSync(); // indexing boxes by nms index
    const scores_data = scores.gather(nms, 0).dataSync(); // indexing scores by nms index
    const classes_data = classes.gather(nms, 0).dataSync(); // indexing classes by nms index
    return [boxes_data, scores_data, classes_data, nms];
}

const preprocess = (source, modelWidth, modelHeight) => {
    let xRatio, yRatio; // ratios for boxes

    const input = tf.tidy(() => {
        const img = tf.browser.fromPixels(source);

        // padding image to square => [n, m] to [n, n], n > m
        const [h, w] = img.shape.slice(0, 2); // get source width and height
        const maxSize = Math.max(w, h); // get max size
        const imgPadded = img.pad([
            [0, maxSize - h], // padding y [bottom only]
            [0, maxSize - w], // padding x [right only]
            [0, 0],
        ]);

        xRatio = maxSize / w; // update xRatio
        yRatio = maxSize / h; // update yRatio

        return tf.image
            .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resize frame
            .div(255.0) // normalize
            .expandDims(0); // add batch
    });

    return [input, xRatio, yRatio];
};