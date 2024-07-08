import { Component, createSignal, onMount, Show } from "solid-js";
import "./App.scss";

import { Toaster } from "solid-toast";
import DataView from "./components/views/DataView";
import { createDataState, DataState } from "./state";
import HistoryView from "./components/views/HistoryView";
import ActionView from "./components/views/ActionView";
import { NavBar } from "./components/views/NavBar";
import ErrorAlert from "./components/views/ErrorAlert";

const App: Component = () => {
	const [z, setZ] = createSignal<undefined | DataState>();

	onMount(async () => {
		const z = await createDataState();
		setZ(z);
	});

	return (
		<>
			<Toaster position="top-center" />

			<NavBar />

			<Show
				when={z()}
				fallback={
					<span
						class="spinner-border spinner-border-lg"
						role="status"
						aria-hidden="true"
					/>
				}>
				<ErrorAlert z={z()!} />

				<div class="container">
					<div class="row">
						<div class="col-12 col-md-8">
							<DataView z={z()!} />
							<hr />
							<h3> Action </h3>
							<ActionView z={z()!} />
						</div>
						<div class="col-12 col-md-4">
							<HistoryView z={z()!} />
						</div>
					</div>
				</div>
			</Show>
		</>
	);
};

export default App;
