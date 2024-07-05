import { Component, Show } from "solid-js";
import { DataState } from "../../state";

const ErrorAlert: Component<{ z: DataState }> = props => {
	return (
		<Show when={props.z.err()}>
			<div class="alert alert-danger m-3" role="alert">
				{props.z.err()}
			</div>
		</Show>
	);
};

export default ErrorAlert;
