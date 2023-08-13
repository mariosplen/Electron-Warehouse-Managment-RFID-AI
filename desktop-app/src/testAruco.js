export const arucoStart = (cameraRef, setScales) => {


	const AR = require('js-aruco').AR;
	const detector = new AR.Detector();


	const canvas = document.createElement('canvas');
	canvas.width = 640;
	canvas.height = 640;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(cameraRef.current, 0, 0, 640, 640);
	const imageData = ctx.getImageData(0, 0, 640, 640);
	const markers = detector.detect(imageData);


	// get the points in variables
	const p1 = markers[0].corners[0];
	const p2 = markers[0].corners[1];
	const p3 = markers[0].corners[2];
	const p4 = markers[0].corners[3];
	console.log(p1, p2, p3, p4)
	// p1 is x and y of top left corner
	// p2 is x and y of top right corner
	// p3 is x and y of bottom right corner
	// p4 is x and y of bottom left corner

	// calculate the width and height of the marker
	const width1 = p2.x - p1.x;
	const width2 = p3.x - p4.x;
	const width = (width1 + width2) / 2;

	const height1 = p3.y - p2.y;
	const height2 = p4.y - p1.y;
	const height = (height1 + height2) / 2;

	// the real marker width and height in mm
	const realWidth = 35;
	const realHeight = 35;

	// the scale factor
	const widthScale = realWidth / width;
	const heightScale = realHeight / height;

	setScales(widthScale, heightScale);


}