import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

const getImageWithPadding = (source, sourceWidth, sourceHeight, modelWidth, modelHeight, nSize) => {
	return tf.tidy(() => {
		const img = tf.browser.fromPixels(source);


		const imgPadded = img.pad([
									  [0, nSize - sourceHeight], // padding y [bottom only]
									  [0, nSize - sourceWidth], // padding x [right only]
									  [0, 0]
								  ]);

		return tf.image
				 .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resize frame
				 .div(255.0) // normalize
				 .expandDims(0); // add batch
	});
};

export default getImageWithPadding;