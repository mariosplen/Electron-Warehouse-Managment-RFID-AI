import React from "react";

const CameraChooserOptions = (props) => {
  console.log("RECOMPOSING OPTIONS");
  console.log(props.availableCameras);
  return (
    <>
      {props.availableCameras.map((camera) => {
        console.log(camera);
        return <option value={camera.deviceId}>{camera.label}</option>;
      })}
    </>
  );
};

export default CameraChooserOptions;
