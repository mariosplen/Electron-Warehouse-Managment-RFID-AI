const getAvailableCameras = (setAvailableCameras) => {
	if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
		navigator.mediaDevices.enumerateDevices().then((devices) => {
			const videoDevices = devices.filter((device) => device.kind === "videoinput");
			setAvailableCameras(videoDevices);
		});
	}
}

export default getAvailableCameras;