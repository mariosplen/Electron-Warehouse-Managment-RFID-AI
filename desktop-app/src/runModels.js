import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import {renderBoxes} from "./utils-general/renderBox";
import getSourceWidthAndHeight from "./utils-model/getSourceWidthAndHeight";
import getPaddingRatiosAndNSize from "./utils-model/getPaddingRatiosAndNSize";
import getImageWithPadding from "./utils-model/getImageWithPadding";
import getArucoMarkers from "./utils-model/getArucoMarkers";
import applyNMS from "./utils-model/applyNMS";
import runObjectDetection from "./utils-model/runObjectDetection";


const setupAndModelsLoop = (cameraRef, model, canvasRef, modelsLoopToggleRef) => {

	// Get source width and height
	const [sourceWidth, sourceHeight] = getSourceWidthAndHeight(cameraRef);

	// Get model width and height
	const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);

	// Will be padding the source image to a square using the bigger side, xRatio and yRatio will be used to convert
	// boxes to source image size
	const [xRatio, yRatio, nSize] = getPaddingRatiosAndNSize(sourceWidth, sourceHeight);

	// get canvas context
	const canvasCtx = canvasRef.getContext("2d");
	canvasCtx.canvas.width = sourceWidth;
	canvasCtx.canvas.height = sourceHeight;

	const AR = require("js-aruco").AR;
	const detector = new AR.Detector();

	const arucoCanvasElement = document.createElement("canvas");
	arucoCanvasElement.width = sourceWidth;
	arucoCanvasElement.height = sourceHeight;

	const arucoCtx = arucoCanvasElement.getContext("2d", {willReadFrequently: true});


	const runModelsLoop = async () => {

		if (!modelsLoopToggleRef.current) {
			canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height); // Clean canvas
			return;
		}

		await runModels(cameraRef, model, canvasCtx, sourceWidth, sourceHeight, modelWidth, modelHeight, nSize, xRatio, yRatio, arucoCtx, detector, () => {
			requestAnimationFrame(runModelsLoop);
		});
	};

	runModelsLoop();
};


export const runModels = async (
	source,
	model,
	canvasCtx,
	sourceWidth, sourceHeight,
	modelWidth, modelHeight,
	nSize,
	xRatio, yRatio,
	arucoCtx,
	detector,
	loadNextFrameIfNotStopped = () => {
	}) => {

	// Start tf engine scoping
	tf.engine().startScope();


	// Get image with padding
	const image = getImageWithPadding(source, sourceWidth, sourceHeight, modelWidth, modelHeight, nSize);


	// Run object detection
	const [boxes, scores, classes, res, transRes] = runObjectDetection(image, model);

	// Apply NMS
	const [boxes_data, scores_data, classes_data, nms] = await applyNMS(boxes, scores, classes);

	// Detect Aruco markers
	const arucoMarkers = getArucoMarkers(detector, arucoCtx, source, sourceWidth, sourceHeight);


	// Render boxes
	renderBoxes(canvasCtx, arucoMarkers, boxes_data, scores_data, classes_data, [xRatio, yRatio]); // render boxes


	// Clear memory
	tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory

	// Run loadNextFrameIfNotStopped, to run next frame with requestAnimationFrame
	loadNextFrameIfNotStopped();

	// End tf engine scoping
	tf.engine().endScope();
};


export default setupAndModelsLoop;










