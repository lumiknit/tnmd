import { converters } from "../data-type/converters";
import { EditSet } from "./edit";
import { executeScript } from "./script";

export type ActionType =
	| "changeType"
	| "changeStr"
	| "parse"
	| "stringify"
	| "runJS"
	| "runGPT"
	| "runGemini";

export type Action = {
	type: ActionType;
	oldD: EditSet;
	newD: EditSet;
};

// Execute

export class ActionApplyError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ActionApplyError";
	}
}

export class ActionApplyWarning extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ActionApplyWarning";
	}
}

export const applyAction = (
	d: EditSet,
	actionType: ActionType,
	updateD?: Partial<EditSet>,
): EditSet => {
	const newD = { ...d };
	const conv = converters.get(d.type)!;

	switch (actionType) {
		case "changeType":
			if (updateD && updateD.type) {
				newD.type = updateD.type;
				const newConv = converters.get(newD.type);
				if (!newConv) {
					throw new ActionApplyError(
						`Convert for the data type ${newD.type} is not found`,
					);
				}
				newD.str = newConv.stringify(newD.data);
			}
			break;
		case "changeStr":
		case "runGPT":
		case "runGemini":
			if (updateD && updateD.str) {
				if (newD.str === updateD.str) {
					throw new ActionApplyWarning("String data is not changed");
				}
				newD.str = updateD.str;
				newD.data = conv.parse(newD.str);
			}
			break;
		case "parse":
			if (typeof d.data !== "string") {
				throw new ActionApplyError("Expected string data to parse");
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
				const exeResult = executeScript(
					updateD.script.script!,
					d.data,
					d.script.scriptWalk,
				);
				if (exeResult.error) {
					throw new ActionApplyError(exeResult.error.message);
				}
				newD.data = exeResult.result;
				newD.str = conv.stringify(newD.data);
				newD.script = updateD.script;
			}
			break;
	}

	return newD;
};
