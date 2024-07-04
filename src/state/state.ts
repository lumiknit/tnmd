import { Accessor, Setter, createSignal } from "solid-js";

/**
 * The state of the application
 */
export type DataState = {
	value: any;

	history: Accessor<any[]>;
	setHistory: Setter<any[]>;
};

/**
 * Create a new DataState object
 */
export const createDataState = (): DataState => {
	const [history, setHistory] = createSignal<any[]>([]);
	return {
		value: "",
		history,
		setHistory,
	};
};
