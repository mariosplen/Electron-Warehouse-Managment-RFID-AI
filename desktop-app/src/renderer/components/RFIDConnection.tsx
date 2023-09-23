import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import React, { useEffect, useState } from "react";
import { RaddecReading } from "../types/RaddecReading";
const { ipcRenderer } = window.require("electron");

// Don't convert to imports! for some reason it doesn't work
const BarnowlLlrp = require("barnowl-llrp");
const Barnowl = require("barnowl");

const RFIDConnection = (props: { onReading: (tag: RaddecReading) => void }) => {
  const storedReaderAddress = localStorage.getItem("readerAddress");
  const [readerAddress, setReaderAddress] = useState(storedReaderAddress || "");
  const [isValidIP, setIsValidIP] = useState(false);
  const [isTouched, setIsTouched] = useState(!!storedReaderAddress);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [reader, setReader] = useState(null);

  useEffect(() => {
    ipcRenderer.on("m2r-connected-to-reader", () => {
      setIsConnected(true);
      setIsConnecting(false);
      localStorage.setItem("readerAddress", readerAddress);
    });

    ipcRenderer.on("m2r-disconnected-from-reader", () => {
      setIsConnected(false);
      setIsConnecting(false);
    });
  }, []);

  useEffect(() => {
    setIsValidIP(isValidIPFormat(readerAddress));
  }, [readerAddress]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setReaderAddress(input);
    setIsValidIP(isValidIPFormat(input));
  };

  const isValidIPFormat = (input) => {
    const ipPattern = /^\d{1,3}(\.\d{1,3}){3}$/;
    return ipPattern.test(input);
  };

  const handleConnect = () => {
    setIsConnecting(true);

    const newReader = new Barnowl({ enableMixing: false });

    newReader.addListener(BarnowlLlrp, {}, BarnowlLlrp.TcpSocketListener, {
      host: readerAddress,
    });

    newReader.on("raddec", (raddec) => {
      const raddecReading: RaddecReading = prepareRaddec(raddec);
      props.onReading(raddecReading);
    });

    setReader(newReader);
  };

  const handleDisconnect = () => {
    window.location.reload();
  };

  return (
    <>
      <Form>
        <Form.Group
          className="mb-3"
          controlId="exampleForm.ControlInput1">
          <Form.Label>Reader Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Reader Address"
            value={readerAddress}
            onChange={handleInputChange}
            isInvalid={!isValidIP && isTouched}
            onSelect={() => setIsTouched(true)}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid IP address.
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
      <Button
        variant="primary"
        disabled={!isValidIP || !isTouched || isConnected || isConnecting}
        onClick={handleConnect}>
        {isConnecting && (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        )}
        {isConnecting ? " Connecting..." : "Connect"}
      </Button>
      <Button
        variant="danger"
        // the button must be enabled when the reader is connected and when the reader is connecting
        disabled={!isConnected && !isConnecting}
        onClick={handleDisconnect}>
        Disconnect
      </Button>
    </>
  );
};
export default RFIDConnection;

const prepareRaddec = (raddec): RaddecReading => {
  return {
    timestamp: new Date().getTime(),
    transmitterId: raddec.transmitterId,
    transmitterIdType: raddec.transmitterIdType,
    transmitterSignature: raddec.signature,
    receiverSignature: raddec.receiverSignature,
    numberOfDecodings: raddec.rssiSignature[0].numberOfDecodings,
    receiverAntenna: raddec.rssiSignature[0].receiverAntenna,
    receiverId: raddec.rssiSignature[0].receiverId,
    receiverIdType: raddec.rssiSignature[0].receiverIdType,
    rssi: raddec.rssiSignature[0].rssi,
  };
};
