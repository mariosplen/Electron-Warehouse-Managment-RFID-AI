import React, {useEffect, useRef, useState} from "react";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import loadModel from "./utils/loadModel";
import getAvailableCameras from "./utils/getAvailableCameras";
import "./styles/App.css";
import {detectVideo} from "./utils/detect";
import setCameraRefSource from "./utils/setCameraRefSource";
import CameraChooser from "./components/CameraChooser";
import {arucoStart} from "./testAruco";


const App = () => {
	const [isModelLoading, setIsModelLoading] = useState({loading: true, progress: 0});
	const [availableCameras, setAvailableCameras] = useState([]);
	const [selectedCamera, setSelectedCamera] = useState(null);
	const [widthScale, setWidthScale] = useState("0.5");
	const [heightScale, setHeightScale] = useState("0.5");
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

				<input type="range" min="0.00001" max="1" step="0.00001"
				       value={widthScale}
				       onChange={e => {
					       setWidthScale(e.target.value)
				       }
				       }
				/>
				<p>{Number(widthScale).toFixed(5)}</p>
				<input type="range" min="0.00001" max="1" step="0.00001"
				       value={heightScale}
				       onChange={e => {
					       setHeightScale(e.target.value)
				       }
				       }
				/>
				<p>{Number(heightScale).toFixed(5)}</p>


				<button onClick={() => {

					arucoStart(cameraRef, (widthScale, heightScale) => {
						setHeightScale(heightScale)
						setWidthScale(widthScale)
					})
				}}>
					print markers on console
				</button>
				{isModelLoading.loading && <p>Loading model... {(isModelLoading.progress * 100).toFixed(2)}%</p>}
				{!isModelLoading.loading && <button
					onClick={
						() => {
							detectVideo(cameraRef.current, model, canvasRef.current, widthScale, heightScale)
						}
					}> Detect
				</button>}
				{!isModelLoading.loading && <button
					onClick={
						() => {
							const url = canvasRef.current.src;
							canvasRef.current.src = ""; // restore video source
							URL.revokeObjectURL(url); // revoke url


							cameraRef.current.value = ""; // reset input video
							cameraRef.current.style.display = "none"; // hide video
						}
					}>Stop Detect
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