import { Component, For, createSignal } from "solid-js";

import CodeMirror, { LANGUAGES } from "../codemirror/CodeMirror";
import { DataState } from "../../state";

type Props = {
	z: DataState;
};

const HistoryView: Component<Props> = props => {
	return (
		<div>
			<ul>
				<li> Hisotyr 1</li>
				<li> Hisotyr 2</li>
			</ul>
		</div>
	);
};

export default HistoryView;
