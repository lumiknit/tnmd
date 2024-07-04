import { Component, createSignal } from "solid-js";

import { DataState } from "../../state";

type Props = {
	z: DataState;
};

const ActionView: Component<Props> = props => {
	return (
		<div>
			Select Action
			<input type="text" />
			<button>Run</button>
		</div>
	);
};

export default ActionView;
