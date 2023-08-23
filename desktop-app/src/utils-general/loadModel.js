import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

const loadModel = (modelURL, setIsModelLoading, setModel) => {
	setIsModelLoading({loading: true, progress: 0}); // set loading to true

	// Load model
	tf.ready().then(async () => {
		const net = await tf.loadGraphModel(
			modelURL,
			{
				onProgress: (fractions) => {
					setIsModelLoading({loading: true, progress: fractions}); // update loading progress
				}
			}
		);

		setIsModelLoading({loading: false, progress: 1});
		setModel({
					 net: net,
					 inputShape: net.inputs[0].shape
				 }); // set model & input shape
	});
};

export default loadModel;