import yaml from "yaml";

import { RawData } from ".";
import { IDataConverter } from "./i-converter";
import { randString } from "./helper";

const pyBulitinReplacer = (rnd: string) => (_: string, value: any) => {
	switch (value) {
		case null:
			return rnd + "None";
		case true:
			return rnd + "True";
		case false:
			return rnd + "False";
		default:
			return value instanceof Map ? Object.fromEntries(value) : value;
	}
};

class PyBuiltinConverter implements IDataConverter {
	get type() {
		return "py-builtin";
	}

	parse(data: string): RawData {
		throw new Error("Method not implemented.");
	}

	stringify(data: RawData): string {
		const j = JSON.stringify(data);
		// Find string not included in json
		let s = randString();
		while (j.includes(s)) {
			s += randString();
		}
		const out = JSON.stringify(data, pyBulitinReplacer(s), 4);
		// Replace `"s` + `"` with `s`
		return out.replace(new RegExp(`"${s}([^"]*)"`), "$1");
	}

	minify(data: RawData): string {
		const j = JSON.stringify(data);
		// Find string not included in json
		let s = randString();
		while (j.includes(s)) {
			s += randString();
		}
		const out = JSON.stringify(data, pyBulitinReplacer(s));
		// Replace `"s` + `"` with `s`
		return out.replace(new RegExp(`"${s}([^"]*)"`), "$1");
	}
}

export const getPyBuiltinConverter = (): IDataConverter =>
	new PyBuiltinConverter();
