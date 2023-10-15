import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReaderStack } from "./utils/ReaderStack";
import CameraChooser from "./components/CameraChooser";
import RFIDConnection from "./components/RFIDConnection";
import { RaddecReading } from "./types/RaddecReading";
import { useEffect, useState } from "react";
const { ipcRenderer } = require("electron");

const addDemoData = async () => {
  ipcRenderer.send("add-demo-data");
};

const App = () => {
  const readerStack: ReaderStack = new ReaderStack([], 3);

  const [dbData, setDbData] = useState([]);

  const getDemoData = async () => {
    const users = await ipcRenderer.send("get-all-users");
    console.log("sent request to get all users");

    ipcRenderer.on("all-users", (event, arg) => {
      console.log("got all users...");
      setDbData(arg);
    });
  };

  useEffect(() => {
    getDemoData();
  }, []);

  // prints the current reading stack
  useEffect(() => {
    console.log(readerStack);
  }, [readerStack]);

  return (
    <>
      <RFIDConnection
        onReading={(tag: RaddecReading) => {
          readerStack.push(tag);
        }}
      />

      <CameraChooser />

      <button onClick={addDemoData}>
        <span className="material-icons">add</span>
      </button>
      <button
        onClick={() => {
          getDemoData();
        }}
      >
        <span className="material-icons">get</span>
      </button>

      <button
        onClick={() => {
          console.log(readerStack);
        }}
      >
        get current tags
      </button>

      {dbData.map((item) => {
        return <div>{item.name}</div>;
      })}
    </>
  );
};

export default App;
