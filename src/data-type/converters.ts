import { getCSVWithHeaderConverter } from "./conv-csv";
import { getJSONConverter } from "./conv-json";
import { getPyBuiltinConverter } from "./conv-py-builtin";
import { getTextConverter } from "./conv-text";
import { getTOMLConverter } from "./conv-toml";
import { getYAMLConverter } from "./conv-yaml";

const converterArray = [
	getTextConverter(),
	getJSONConverter(),
	getYAMLConverter(),
	getTOMLConverter(),
	getCSVWithHeaderConverter(),
	getPyBuiltinConverter(),
];

export const converters = new Map(converterArray.map(c => [c.type, c]));
