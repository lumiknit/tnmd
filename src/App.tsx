import { Component, For, createSignal } from "solid-js";
import "./App.scss";

import { Toaster } from "solid-toast";
import DataView from "./components/views/DataView";
import { createDataState } from "./state";
import HistoryView from "./components/views/HistoryView";
import ActionView from "./components/views/ActionView";

const App: Component = () => {
	const z = createDataState();

	return (
		<>
			<Toaster position="top-center" />

			<div class="row">
				<div class="col-12 col-md-8">
					<DataView z={z} />
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
