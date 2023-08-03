import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl

const loadModel = (modelURL, setIsModelLoading, setModel) => {
	tf.ready().then(async () => {
		const net = await tf.loadGraphModel(
			modelURL,
			{
				onProgress: (fractions) => {
					setIsModelLoading({loading: true, progress: fractions}); // set loading fractions
				},
			}
		);

		// warming up model
		const dummyInput = tf.ones(net.inputs[0].shape);
		const warmupResults = net.execute(dummyInput);

		setIsModelLoading({loading: false, progress: 1});
		setModel({
			net: net,
			inputShape: net.inputs[0].shape,
		}); // set model & input shape

		tf.dispose([warmupResults, dummyInput]); // cleanup memory
	});
}

export default loadModel;