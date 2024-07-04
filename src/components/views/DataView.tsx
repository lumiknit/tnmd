import { Component, For, createSignal } from "solid-js";

import CodeMirror, { LANGUAGES } from "../codemirror/CodeMirror";
import { DataState } from "../../state";

type Props = {
	z: DataState;
};

const DataView: Component<Props> = props => {
	const [grammar, setGrammar] = createSignal("javascript");

	const tabs = ["main", "history", "actions"];

	const [currentTab, setCurrentTab] = createSignal(tabs[0]);

	return (
		<>
			<ul class="nav nav-pills">
				<For each={tabs}>
					{tab => (
						<li class="nav-item">
							<a
								class="nav-link"
								classList={{
									active: currentTab() === tab,
								}}
								href="#"
								onClick={e => {
									e.preventDefault();
									setCurrentTab(tab);
								}}>
								{tab}
							</a>
						</li>
					)}
				</For>
			</ul>
			<CodeMirror
				grammar={grammar()}
				text="console.log('Hello World')"
				onChange={text => console.log(text)}
			/>
		</>
	);
};

export default DataView;
