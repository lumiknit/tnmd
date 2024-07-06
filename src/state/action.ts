import { converters } from "../data-type/converters";
import { DataSet } from "./data";
import { executeScript } from "./script";

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

// Execute

export const applyAction = (
	d: DataSet,
	actionType: ActionType,
	updateD?: Partial<DataSet>,
): DataSet => {
	const newD = { ...d };
	const conv = converters.get(d.type)!;

	switch (actionType) {
		case "changeType":
			if (updateD && updateD.type) {
				newD.type = updateD.type;
				const newConv = converters.get(newD.type);
				if (!newConv) {
					throw new Error(
						`Convert for the data type ${newD.type} is not found`,
					);
				}
				newD.str = newConv.stringify(newD.data);
			}
			break;
		case "changeStr":
			if (updateD && updateD.str) {
				newD.str = updateD.str;
				newD.data = conv.parse(newD.str);
			}
			break;
		case "parse":
			if (typeof d.data !== "string") {
				throw new Error("Expected string data to parse");
			}
			newD.data = conv.parse(d.data as string);
			newD.str = conv.stringify(newD.data);
			break;
		case "stringify":
			newD.str = newD.data = conv.stringify(d.data);
			newD.type = "text";
			console.log(newD);
			break;
		case "runJS":
			if (updateD && updateD.script) {
				const exeResult = executeScript(updateD.script!, d.data);
				if (exeResult.error) {
					throw exeResult.error;
				}
				newD.data = exeResult.result;
				newD.str = conv.stringify(newD.data);
				newD.script = updateD.script;
			}
			break;
	}

	return newD;
};
