export type DataType =
	| "json"
	| "xml"
	| "yaml"
	| "csv"
	| "text"
	| "toml"
	| "markdown-table"
	| "py-builtin"
	| "go-builtin";

/** JSON-like object. */
export type RawData =
	| null
	| boolean
	| number
	| string
	| RawData[]
	| Map<string, RawData>;

export type StringKeyObject = { [key: string]: any };
