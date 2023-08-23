const getPaddingRatiosAndNSize = (sourceWidth, sourceHeight) => {

	const nSize = Math.max(sourceWidth, sourceHeight);

	const xRatio = sourceWidth / nSize;
	const yRatio = sourceHeight / nSize;

	return [xRatio, yRatio, nSize];
};

export default getPaddingRatiosAndNSize;