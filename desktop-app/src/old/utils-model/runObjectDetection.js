import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import labels from "../utils-general/labels.json"; // set backend to webgl

const numClass = labels.length;

const runObjectDetection = (image, model) => {
	// Run model
	const res = model.net.execute(image);
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
					tf.add(x1, w) //x2
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

	return [boxes, scores, classes, res, transRes];
};

export default runObjectDetection;