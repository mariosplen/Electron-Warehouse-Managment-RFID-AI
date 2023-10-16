import { ReaderStack } from "../utils/ReaderStack";
import CameraChooser from "../components/CameraChooser";
import RFIDConnection from "../components/RFIDConnection";
import { RaddecReading } from "../types/RaddecReading";

const Home = () => {
  const readerStack: ReaderStack = new ReaderStack([], 15);

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

export default Home;
