import { Component } from "solid-js";

type Props = {
	z: DataState;
};

const ActionGeminiView: Component<Props> = props => {
	return (
		<>
			<input type="text" placeholder="API key" />
			<textarea placeholder="API secret" />
			<select>
				<option value="1.5-flash"> 1.5-flash </option>
				<option value="sell">Sell</option>
			</select>
			<button>Send</button>
		</>
	);
};
