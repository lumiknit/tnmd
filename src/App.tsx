import { Component } from "solid-js";
import "./App.scss";

import { Toaster } from "solid-toast";
import DataView from "./components/views/DataView";
import { createDataState } from "./state";
import HistoryView from "./components/views/HistoryView";
import ActionView from "./components/views/ActionView";
import { NavBar } from "./components/views/NavBar";
import ErrorAlert from "./components/views/ErrorAlert";

const App: Component = () => {
	const z = createDataState();

	return (
		<>
			<Toaster position="top-center" />

			<NavBar />

			<ErrorAlert z={z} />

			<div class="row p-2">
				<div class="col-12 col-md-8">
					<DataView z={z} />
					<hr />
					<h3> Action </h3>
					<ActionView z={z} />
				</div>
				<div class="col-12 col-md-4">
					<HistoryView z={z} />
				</div>
			</div>
		</>
	);
};

export default App;
