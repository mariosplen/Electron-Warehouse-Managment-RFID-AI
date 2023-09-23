import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReaderStack } from "./utils/ReaderStack";
import CameraChooser from "./components/CameraChooser";
import RFIDConnection from "./components/RFIDConnection";
import { RaddecReading } from "./types/RaddecReading";

const App = () => {
  const readerStack: ReaderStack = new ReaderStack([], 3);

  return (
    <>
      <RFIDConnection
        onReading={(tag: RaddecReading) => {
          readerStack.push(tag);
        }}
      />

      <CameraChooser />
    </>
  );
};

export default App;
