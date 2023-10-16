const { ipcRenderer } = require("electron");
import { useEffect, useState } from "react";

const Data = () => {
  const [dbData, setDbData] = useState([]);

  useEffect(() => {
    ipcRenderer.send("get-all-users");
    ipcRenderer.on("all-users", (event, data) => {
      setDbData(data);
      console.log(data);
    });
  }, []);

  return (
    <div>
      <h1>Data</h1>
    </div>
  );
};

export default Data;
