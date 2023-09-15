import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

const applyNMS = async (boxes, scores, classes, maxOutputSize = 500, iouThreshold = 0.45, scoreThreshold = 0.2) => {
	const nms = await tf.image.nonMaxSuppressionAsync(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold); // NMS to filter boxes

	const boxes_data = boxes.gather(nms, 0).dataSync(); // indexing boxes by nms index
	const scores_data = scores.gather(nms, 0).dataSync(); // indexing scores by nms index
	const classes_data = classes.gather(nms, 0).dataSync(); // indexing classes by nms index
	return [boxes_data, scores_data, classes_data, nms];
};

export default applyNMS;