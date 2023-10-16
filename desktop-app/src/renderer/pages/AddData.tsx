import { useRef } from "react";

const { ipcRenderer } = require("electron");

const AddData = () => {
  const uidRef = useRef(null);
  const contentsRef = useRef(null);
  const isFragileRef = useRef(null);
  const weightRef = useRef(null);
  const lengthRef = useRef(null);
  const widthRef = useRef(null);
  const heightRef = useRef(null);

  const submitHandler = (event) => {
    event.preventDefault();

    const uid = uidRef.current.value;
    const contents = contentsRef.current.value;
    const isFragile = isFragileRef.current.checked;
    const weight = Number(weightRef.current.value);
    const length = Number(lengthRef.current.value);
    const width = Number(widthRef.current.value);
    const height = Number(heightRef.current.value);

    ipcRenderer.send("add-box", {
      uid,
      contents,
      isFragile,
      weight,
      length,
      width,
      height,
    });
  };

  return (
    <form style={{ display: "flex", flexDirection: "column", width: "260px" }}>
      <label htmlFor="uid">UID:</label>
      <input type="text" ref={uidRef} id="uid" />
      <label htmlFor="contents">Contents:</label>
      <input type="text" ref={contentsRef} id="contents" />
      <label htmlFor="isFragile">Is Fragile:</label>
      <input type="checkbox" ref={isFragileRef} id="isFragile" />
      <label htmlFor="weight">Weight in killograms:</label>
      <input type="number" ref={weightRef} id="weight" />
      <label htmlFor="length">Length in cm:</label>
      <input type="number" ref={lengthRef} id="length" />
      <label htmlFor="width">Width in cm:</label>
      <input type="number" ref={widthRef} id="width" />
      <label htmlFor="height">Height in cm:</label>
      <input type="number" ref={heightRef} id="height" />
      <input type="submit" value="Submit" onClick={submitHandler} />
    </form>
  );
};

export default AddData;
