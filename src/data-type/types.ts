export type DataType =
	| "text"
	| "json"
	| "yaml"
	| "csv-with-headers"
	| "toml"
	| "py-builtin";

export const DATA_TYPES: DataType[] = [
	"text",
	"json",
	"yaml",
	"csv-with-headers",
	"toml",
	"py-builtin",
];

/** JSON-like object. */
export type RawData =
	| null
	| boolean
	| number
	| string
	| RawData[]
	| Map<string, RawData>;

export type StringKeyObject = { [key: string]: any };

export const DATA_TYPE_TO_GRAMMAR: { [key in DataType]: string } = {
	text: "text",
	json: "json",
	yaml: "yaml",
	"csv-with-headers": "csv",
	toml: "toml",
	"py-builtin": "python",
};
