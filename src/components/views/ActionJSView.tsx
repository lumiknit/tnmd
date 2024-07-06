import toast from "solid-toast";
import { DataState, execJS } from "../../state";
import { Component, For } from "solid-js";
import CodeMirror from "../codemirror/CodeMirror";
import { TbRocket, TbTrash } from "solid-icons/tb";
import { SCRIPT_SAMPLES } from "../../state/script-samples";

type Props = {
	z: DataState;
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

			<div class="row">
				<div class="col">
					<label class="form-check form-check-label">
						<input
							class="form-check-input"
							type="checkbox"
							checked={props.z.d().scriptWalk}
							onChange={e =>
								props.z.setD(d => ({
									...d,
									scriptWalk: e.currentTarget.checked,
								}))
							}
						/>
						Walk (run function for each item in array/object)
					</label>
				</div>
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

			<h6> Examples </h6>
			<div>
				<For each={SCRIPT_SAMPLES}>
					{sample => (
						<button
							class="btn btn-sm btn-outline-secondary m-1"
							onClick={() =>
								props.z.setD(d => ({
									...d,
									script: sample.code,
									scriptWalk: sample.walk || false,
								}))
							}>
							{sample.name}
						</button>
					)}
				</For>
			</div>
		</div>
	);
};

export default JsActionView;
