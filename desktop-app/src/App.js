import React, {useEffect, useRef, useState} from "react";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import loadModel from "./utils/loadModel";
import getAvailableCameras from "./utils/getAvailableCameras";
import "./styles/App.css";
import {runModelLoop} from "./utils/runModels";
import setCameraRefSource from "./utils/setCameraRefSource";
import CameraChooser from "./components/CameraChooser";


const App = () => {

    const [availableCameras, setAvailableCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);


    const [isODModelLoading, setIsODModelLoading] = useState({
        loading: false,
        progress: 0
    });
    const [model, setModel] = useState({
        net: null,
        inputShape: [1, 0, 0, 3],
    });


    const cameraRef = useRef(null);
    const canvasRef = useRef(null);
    const modelsLoopToggleRef = useRef(false);

    const modelName = "carton";

    const resourcePath =
        !process.env.NODE_ENV || process.env.NODE_ENV === "production"
            ? process.resourcesPath // Prod mode
            : `https://raw.githubusercontent.com/mariosplen/Carton-Scanner-RFID/master/desktop-app`; // Dev mode

    const modelPath = `${resourcePath}/assets/${modelName}_web_model/model.json`;


    // Load model
    useEffect(() => {
        loadModel(modelPath, setIsODModelLoading, setModel);
    }, []);

    // Get available cameras
    useEffect(() => {
        getAvailableCameras(setAvailableCameras);
    }, []);

    // Set default selected camera when available cameras change
    useEffect(() => {
        if (availableCameras.length <= 0) {
            return
        }
        // Check if selected camera's id is equal in a camera id in available cameras
        if (selectedCamera !== null && availableCameras.some((camera) => camera.deviceId === selectedCamera.deviceId)) {
            return
        }

        setSelectedCamera(availableCameras[0]);
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
                {isODModelLoading.loading && <p>Loading model... {(isODModelLoading.progress * 100).toFixed(2)}%</p>}
                {!isODModelLoading.loading && <button
                    onClick={
                        () => {
                            modelsLoopToggleRef.current = true;
                            runModelLoop(cameraRef.current, model, canvasRef.current, modelsLoopToggleRef)
                        }
                    }> Start
                </button>}
                {!isODModelLoading.loading && <button
                    onClick={
                        () => {
                            modelsLoopToggleRef.current = false;
                        }
                    }>Stop
                </button>}

                <CameraChooser availableCameras={availableCameras} selectedCamera={selectedCamera}
                               setSelectedCamera={setSelectedCamera}/>
                <button onClick={() => {
                    getAvailableCameras(setAvailableCameras)
                }}>
                    Refresh Camera List
                </button>

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