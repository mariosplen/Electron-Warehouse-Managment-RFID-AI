export const renderBoxes = (canvasCtx, arucoMarkers, boxes_data, scores_data) => {
	canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height); // clean canvas
	// increase the stroke size
	canvasCtx.lineWidth = 6;

	for (let i = 0; i < scores_data.length; ++i) {
		const color = "#FF3838";
		const score = (scores_data[i] * 100).toFixed(1);

		if (score < 40) continue;

		let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);

		const width = x2 - x1;
		const height = y2 - y1;

		for (let j = 0; j < arucoMarkers.length; ++j) {
			const greenColor = "#3eff00";

			// Get the points of the ArUco marker.
			const arucoCorners = arucoMarkers[j].corners;
			const arucoX1 = arucoCorners[0].x;
			const arucoX2 = arucoCorners[1].x;
			const arucoY1 = arucoCorners[0].y;
			const arucoY3 = arucoCorners[2].y;

			// Check if the ArUco rectangle is inside the red rectangle.
			if (arucoX1 >= x1 && arucoX2 <= x2 && arucoY1 >= y1 && arucoY3 <= y2) {
				// Draw red border box.
				canvasCtx.strokeStyle = color;
				canvasCtx.strokeRect(x1, y1, width, height);

				// Calculate ArUco rectangle dimensions.
				const arucoWidth = arucoX2 - arucoX1;
				const arucoHeight = arucoY3 - arucoY1;

				// Draw green border box for the ArUco rectangle.
				canvasCtx.strokeStyle = greenColor;
				canvasCtx.strokeRect(arucoX1, arucoY1, arucoWidth, arucoHeight);

				const realArucoWidth = 35;
				const realArucoHeight = 35;

				const widthScale = realArucoWidth / arucoWidth;
				const heightScale = realArucoHeight / arucoHeight;

				// Display on the red rectangle the size of the box.
				canvasCtx.font = "30px Arial";
				canvasCtx.fillStyle = "white";
				canvasCtx.fillText(
					`${((width * widthScale) / 10).toFixed(1)} x ${((height * heightScale) / 10).toFixed(1)}`,
					x1,
					y1 - 10
				);

				break; // Break the loop if an ArUco marker is found within the red rectangle.
			}
		}
	}
};
