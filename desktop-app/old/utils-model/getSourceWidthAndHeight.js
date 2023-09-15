import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

const getSourceWidthAndHeight = (source) => {
	let w, h;
	tf.tidy(() => {
		const img = tf.browser.fromPixels(source);
		[h, w] = img.shape.slice(0, 2); // get source width and height
	});
	return [w, h];
};

export default getSourceWidthAndHeight;