import React from "react";

const CameraChooser = (props) => {
    return (
        <div>
            <select
                defaultValue={props.selectedCamera}
                onChange={(e) => {
                    const cam = props.availableCameras.find((cam) => cam.deviceId === e.target.value);

                    props.setSelectedCamera(cam);
                }
                }
            >
                {props.availableCameras.map((cam) => (
                    <option
                        key={cam.deviceId}
                        value={cam.deviceId}
                    >
                        {cam.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default CameraChooser;