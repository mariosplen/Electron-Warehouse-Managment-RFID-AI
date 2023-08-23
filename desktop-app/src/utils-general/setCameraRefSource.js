const setCameraRefSource = (cameraRef, selectedCamera) => {
	navigator.mediaDevices
			 .getUserMedia({
							   video: {
								   deviceId: selectedCamera.deviceId
							   }
						   })
			 .then((stream) => {
				 cameraRef.current.srcObject = stream;
				 cameraRef.current.style.display = "block";
			 });
};

export default setCameraRefSource;

