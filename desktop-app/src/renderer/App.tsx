import React from "react";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ReaderStack } from "./utils/ReaderStack";

import {
  Routes,
  Route,
  BrowserRouter,
  Link,
  HashRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Data from "./pages/Data";
import AddData from "./pages/AddData";

const About = () => {
  return <h1>About</h1>;
};

const App = () => {
  return (
    <HashRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/data">Data</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AddData />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
