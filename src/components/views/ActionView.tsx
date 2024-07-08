import { Component, For, createSignal } from "solid-js";

import { DataState, execParse, execStringify } from "../../state";
import { TbCodeDots, TbQuote } from "solid-icons/tb";
import { Dynamic } from "solid-js/web";
import JsActionView from "./ActionJSView";
import ActionGPTView from "./ActionGPTView";
import ActionGeminiView from "./ActionGeminiView";

type Props = {
	z: DataState;
};

const MainActionView: Component<Props> = props => {
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

type ActionTabInfo = {
	label: string;
	component: Component<Props>;
};

const ACTION_TAB_INFO: ActionTabInfo[] = [
	{
		label: "Main",
		component: MainActionView,
	},
	{
		label: "JS",
		component: JsActionView,
	},
	{
		label: "GPT",
		component: ActionGPTView,
	},
	{
		label: "Gemini",
		component: ActionGeminiView,
	},
];

const ActionView: Component<Props> = props => {
	const [tab, setTab] = createSignal<number>(0);
	return (
		<div>
			<ul class="nav nav-pills mb-2">
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
