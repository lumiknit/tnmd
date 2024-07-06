import { Accessor, Setter, batch, createSignal } from "solid-js";
import { DataType } from "../data-type";
import { ActionType, Action, applyAction } from ".";
import { converters } from "../data-type/converters";
import { executeScript } from "./script";
import { DataSet } from "./data";
import toast from "solid-toast";

export type DataHistory = {
	/**
	 * Previous histories
	 * The top of the stack is the most recent history
	 */
	actions: Action[];

	p: number;
};

/**
 * The state of the application
 */
export type DataState = {
	d: Accessor<DataSet>;
	setD: Setter<DataSet>;

	err: Accessor<string>;
	setErr: Setter<string>;

	history: Accessor<DataHistory>;
	setHistory: Setter<DataHistory>;
};

/**
 * Create a new DataState object
 */
export const createDataState = (): DataState => {
	const [d, setD] = createSignal<DataSet>(
		{
			type: "text",
			str: "",
			data: "",
			script: "",
		},
		{ equals: false },
	);

	const [err, setErr] = createSignal<string>("");

	const [history, setHistory] = createSignal<DataHistory>(
		{
			actions: [],
			p: 0,
		},
		{ equals: false },
	);

	return {
		d,
		setD,
		err,
		setErr,
		history,
		setHistory,
	};
};

export const execAction = (
	state: DataState,
	actionType: ActionType,
	updateD?: Partial<DataSet>,
) => {
	batch(() => {
		state.setErr("");

		const d = state.d();
		let newD: DataSet;

		try {
			newD = applyAction(d, actionType, updateD);
		} catch (e) {
			state.setErr("Failed to execute action: " + e);
			console.error(e);
			toast.error("Error");
			return;
		}

		const action = { type: actionType, oldD: d, newD };

		// Update the history
		state.setHistory(h => ({
			actions: [...h.actions.slice(0, h.p), action],
			p: h.p + 1,
		}));

		// Update d
		state.setD(newD);
	});
};

/**
 * Based on history, restore the state to the given index.
 * For example, if idx = 4, the undo stack size will be 4.
 */
export const restoreTo = (
	state: DataState,
	idx: number,
	relative?: boolean,
) => {
	batch(() => {
		const history = state.history();
		const cur = history.p;
		const size = history.actions.length;
		if (relative) {
			idx += cur;
		}
		if (idx < 0) {
			throw new Error("Cannot undo");
		} else if (idx > size) {
			throw new Error("Cannot redo");
		}

		if (idx >= cur) {
			// Redo
			state.setD(history.actions[idx - 1].newD);
		} else {
			state.setD(history.actions[idx].oldD);
		}

		state.setErr("");
		state.setHistory(h => ({
			actions: h.actions,
			p: idx,
		}));
	});
};

export const undoAction = (state: DataState) => restoreTo(state, -1, true);

export const redoAction = (state: DataState) => restoreTo(state, 1, true);

// Derived action runner

export const execChangeType = (state: DataState, newType: DataType) => {
	execAction(state, "changeType", { type: newType });
};

export const execParse = (state: DataState) => {
	execAction(state, "parse");
};

export const execStringify = (state: DataState) => {
	execAction(state, "stringify");
};

export const execJS = (state: DataState, script: string) => {
	execAction(state, "runJS", { script });
};

export const execSetText = (state: DataState, text: string) => {
	execAction(state, "changeStr", { str: text });
};
