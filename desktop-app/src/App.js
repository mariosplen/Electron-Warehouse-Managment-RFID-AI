import React, {useEffect, useRef, useState} from "react";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import loadModel from "./utils/loadModel";
import getAvailableCameras from "./utils/getAvailableCameras";
import "./styles/App.css";
import {detectVideo} from "./utils/detect";
import setCameraRefSource from "./utils/setCameraRefSource";
import CameraChooser from "./components/CameraChooser";


const App = () => {
	const [isModelLoading, setIsModelLoading] = useState({loading: true, progress: 0});
	const [availableCameras, setAvailableCameras] = useState([]);
	const [selectedCamera, setSelectedCamera] = useState(null);
	const [model, setModel] = useState({
		net: null,
		inputShape: [1, 0, 0, 3],
	});


	const cameraRef = useRef(null);
	const canvasRef = useRef(null);

	const modelName = "carton";

	const resourcePath =
		!process.env.NODE_ENV || process.env.NODE_ENV === "production"
			? process.resourcesPath // Prod mode
			: `https://raw.githubusercontent.com/mariosplen/Carton-Scanner-RFID/master/desktop-app`; // Dev mode

	const modelPath = `${resourcePath}/assets/${modelName}_web_model/model.json`;


	// Load model
	useEffect(() => {
		loadModel(modelPath, setIsModelLoading, setModel);
	}, []);

	// Get available cameras
	useEffect(() => {
		getAvailableCameras(setAvailableCameras);
	}, []);

	// Set default selected camera when available cameras change
	useEffect(() => {
		if (availableCameras.length > 0) {
			setSelectedCamera(availableCameras[0]);
		}
	}, [availableCameras]);

	// Set the cameraRef stream source to the selected camera
	useEffect(() => {
		if (selectedCamera !== null) {
			setCameraRefSource(cameraRef, selectedCamera)
		}
	}, [selectedCamera]);


	return (
		<div className="App">
			<>
				<button onClick={() => {

					const AR = require('js-aruco').AR;
					const detector = new AR.Detector();

					const {video} = cameraRef.current;
					console.log(cameraRef)
					console.log(cameraRef.current)
					console.log(video)

					const canvas = document.createElement('canvas');
					canvas.width = 640;
					canvas.height = 640;
					const ctx = canvas.getContext('2d');
					ctx.drawImage(cameraRef.current, 0, 0, 640, 640);
					const imageData = ctx.getImageData(0, 0, 640, 640);
					const markers = detector.detect(imageData);
					console.log(markers);
				}}>
					print markers on console
				</button>
				{isModelLoading.loading && <p>Loading model... {(isModelLoading.progress * 100).toFixed(2)}%</p>}
				{!isModelLoading.loading && <button
					onClick={
						() => {
							detectVideo(cameraRef.current, model, canvasRef.current)
						}
					}> Detect
				</button>}

				<CameraChooser availableCameras={availableCameras} selectedCamera={selectedCamera}
				               setSelectedCamera={setSelectedCamera}/>

				<div className="content">
					<video
						autoPlay
						muted
						ref={cameraRef}
					/>
					<canvas width={model.inputShape[1]} height={model.inputShape[2]} ref={canvasRef}/>
				</div>
			</>
		</div>
	);
};

export default App;