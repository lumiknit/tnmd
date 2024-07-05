import { Component, For, createMemo, createSignal } from "solid-js";

import CodeMirror from "../codemirror/CodeMirror";
import { DataState, execChangeType, execSetText } from "../../state";
import { DATA_TYPES, DATA_TYPE_TO_GRAMMAR } from "../../data-type";
import { Dynamic } from "solid-js/web";
import ObjectList from "../ObjectList";
import toast from "solid-toast";

type Props = {
	z: DataState;
};

// Code mirror view

const CMDataView: Component<Props> = props => {
	const grammar = createMemo(() => DATA_TYPE_TO_GRAMMAR[props.z.d().type]);
	const text = createMemo(() => props.z.d().str);
	return (
		<div class="cm-wrap">
			<CodeMirror
				grammar={grammar()}
				text={text()}
				onChange={text => {
					console.log("Data view changed");
					execSetText(props.z, text);
				}}
			/>
		</div>
	);
};

// List view

const ListDataView: Component<Props> = props => {
	return <ObjectList data={props.z.d().data} />;
};

type TabInfo = {
	label: string;
	component: Component<Props>;
};

const cmTab: TabInfo = {
	label: "Editor",
	component: CMDataView,
};

const listTab: TabInfo = {
	label: "List",
	component: ListDataView,
};

const tabs = [cmTab, listTab];

const DataView: Component<Props> = props => {
	const [currentTab, setCurrentTab] = createSignal(0);

	const currentType = () => props.z.d().type;

	const handleDataTypeChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		const value = target.value as any;
		if (!DATA_TYPES.includes(value)) {
			toast.error("Invalid data type");
			console.error("Invalid data type", value);
			return;
		}
		console.log(value);
		execChangeType(props.z, value);
	};

	return (
		<>
			<div class="input-group my-2">
				<div class="input-group-text">Type</div>
				<select class="form-select" onChange={handleDataTypeChange}>
					<For each={DATA_TYPES}>
						{type => (
							<option selected={type === currentType()} value={type}>
								{type}
							</option>
						)}
					</For>
				</select>
			</div>
			<ul class="nav nav-pills mb-2">
				<For each={tabs}>
					{(tab, idx) => (
						<li class="nav-item">
							<a
								class="nav-link"
								classList={{
									active: currentTab() === idx(),
								}}
								href="#"
								onClick={e => {
									e.preventDefault();
									setCurrentTab(idx());
								}}>
								{tab.label}
							</a>
						</li>
					)}
				</For>
			</ul>
			<Dynamic component={tabs[currentTab()].component} z={props.z} />
		</>
	);
};

export default DataView;
