import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const CameraChooser = () => {
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);

  const getAvailableCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  };

  const cameraRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getAvailableCameras().then((cameras) => {
      setAvailableCameras(cameras);
    });
  }, []);

  useEffect(() => {
    if (availableCameras.length === 0) {
      setSelectedCamera(null);
      return;
    }

    if (selectedCamera === null) {
      setSelectedCamera(availableCameras[0]);
      return;
    }
    const selectedCameraNotAvailable = availableCameras.every(
      (camera) => camera.deviceId !== selectedCamera.deviceId
    );
    if (selectedCameraNotAvailable) {
      setSelectedCamera(availableCameras[0]);
      return;
    }
  }, [availableCameras]);
  useEffect(() => {
    if (selectedCamera === null) {
      return;
    }
    // Set Camera Ref Source
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: selectedCamera.deviceId,
        },
      })
      .then((stream) => {
        cameraRef.current.srcObject = stream;
      });
  }, [selectedCamera]);

  return (
    <>
      <Button
        as="input"
        type="button"
        value="Refresh Cameras List"
        onClick={() => {
          getAvailableCameras().then((cameras) => {
            setAvailableCameras(cameras);
          });
        }}
      />
      <Form.Select
        aria-label="Default select example"
        defaultValue={selectedCamera ? selectedCamera.deviceId : null}
        onChange={(e) => {
          setSelectedCamera(
            availableCameras.find(
              (camera) => camera.deviceId === e.target.value
            )
          );
        }}>
        {availableCameras.map((camera) => {
          return (
            <option
              key={camera.deviceId}
              value={camera.deviceId}>
              {camera.label}
            </option>
          );
        })}
      </Form.Select>
      {!selectedCamera && (
        <p>No Cameras Found... Please connect a Camera to the Computer</p>
      )}

      <div className="content">
        <video
          autoPlay
          muted
          ref={cameraRef}
        />
        <canvas ref={canvasRef} />
      </div>
    </>
  );
};

export default CameraChooser;
