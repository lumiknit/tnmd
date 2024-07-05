import { Component, For, Match, Switch, createSignal } from "solid-js";

import {
	DataState,
	execJS,
	execChangeType,
	execParse,
	execStringify,
} from "../../state";
import { DATA_TYPES } from "../../data-type";
import CodeMirror from "../codemirror/CodeMirror";
import { TbCodeDots, TbQuote, TbRocket, TbTrash } from "solid-icons/tb";
import toast from "solid-toast";
import { Dynamic } from "solid-js/web";

type Props = {
	z: DataState;
};

const TypeActionView: Component<Props> = props => {
	return (
		<>
			<div class="btn-group">
				<button
					class="btn btn-outline-secondary d-flex align-items-center gap-2"
					onClick={() => execParse(props.z)}>
					<TbCodeDots />
					Parse
				</button>
				<button
					class="btn btn-outline-secondary d-flex align-items-center gap-2"
					onClick={() => execStringify(props.z)}>
					<TbQuote />
					Stringify
				</button>
			</div>
		</>
	);
};

const JsActionView: Component<Props> = props => {
	const handleRun = () => {
		const script = props.z.d().script;
		execJS(props.z, script);
	};

	const handleClear = () => {
		props.z.setD(d => ({
			...d,
			script: "",
		}));
		toast.success("Cleared");
	};
	return (
		<div>
			<div class="btn-group my-2">
				<button class="btn btn-primary" onClick={handleRun}>
					<TbRocket />
					Run
				</button>
				<button class="btn btn-danger" onClick={handleClear}>
					<TbTrash />
					Clear
				</button>
			</div>

			<div class="cm-wrap">
				<CodeMirror
					grammar="javascript"
					text={props.z.d().script}
					onChange={text => props.z.setD(d => ({ ...d, script: text }))}
				/>
			</div>
			<h6> Note </h6>
			<ul>
				<li>
					The code should be an anonymous function, takes single value and
					return a value
				</li>
			</ul>
		</div>
	);
};

type ActionTabInfo = {
	label: string;
	component: Component<Props>;
};

const ACTION_TAB_INFO: ActionTabInfo[] = [
	{
		label: "Type",
		component: TypeActionView,
	},
	{
		label: "JS",
		component: JsActionView,
	},
];

const ActionView: Component<Props> = props => {
	const [tab, setTab] = createSignal<number>(0);
	return (
		<div>
			<ul class="nav nav-pills">
				<For each={ACTION_TAB_INFO}>
					{(info, idx) => (
						<li class="nav-item">
							<a
								href="#"
								class="nav-link"
								classList={{ active: tab() === idx() }}
								onClick={() => setTab(idx())}>
								{info.label}
							</a>
						</li>
					)}
				</For>
			</ul>
			<Dynamic component={ACTION_TAB_INFO[tab()].component} z={props.z} />
		</div>
	);
};

export default ActionView;
