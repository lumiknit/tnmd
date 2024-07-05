import { DataSet } from "./data";

export type ActionType =
	| "changeType"
	| "changeStr"
	| "parse"
	| "stringify"
	| "runJS";

export type Action = {
	type: ActionType;
	oldD: DataSet;
	newD: DataSet;
};
