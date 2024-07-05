/* @refresh reload */
import { render } from "solid-js/web";

import "./bootstrap-import";
import "./dark-mode-detect";

import "./index.css";
import App from "./App";

const root = document.getElementById("root");

render(() => <App />, root!);
