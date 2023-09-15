const getArucoMarkers = (detector, arucoCtx, source, w, h) => {
	arucoCtx.drawImage(source, 0, 0, w, h);
	const imageData = arucoCtx.getImageData(0, 0, w, h);
	return detector.detect(imageData);
};

export default getArucoMarkers;