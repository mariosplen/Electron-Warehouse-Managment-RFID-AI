

import '../../index.css';

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.min.css';
import App from '../renderer/App';




const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
)