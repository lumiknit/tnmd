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

export type StringKeyObject<T> = { [key: string]: T };

/**
 * Map the raw data using the ginen function.
 * The order or traversal is not guaranteed.
 */
export const mapRawData = (
	root: RawData,
	fn: (data: RawData) => RawData,
): RawData => {
	if (Array.isArray(root)) {
		root = root.map(d => mapRawData(d, fn));
	} else if (root instanceof Map) {
		const m = new Map<string, RawData>();
		for (const [k, v] of root) {
			m.set(k, mapRawData(v, fn));
		}
		root = m;
	}
	return fn(root);
};

/**
 * Spreaded raw data.
 * The first element is container, and the second element
 * is the key for the next value.
 * For example,
 * [[42, true], 2], [{}, "a"] with value v will be [42, true {"a": v}]
 */
export type SpreadedRawData = (
	| [RawData[], number]
	| [Map<string, RawData>, string]
)[];

/**
 * Push the value to the spreaded raw data's last entry.
 */
export const pushValueToSpreadedRawData = (
	stack: SpreadedRawData,
	value: RawData,
) => {
	const l = stack.length - 1;
	if (l < 0) return;
	const [container, key] = stack[l];
	if (Array.isArray(container)) {
		container.push(value);
		stack[l][1] = container.length;
	} else {
		container.set(key as string, value);
		stack[l][1] = "";
	}
};

/**
 * Reduce the spreaded raw data to a single raw data.
 */
export const reduceSpreadedRawData = (
	stack: SpreadedRawData,
	v?: RawData,
): RawData => {
	while (stack.length > 0) {
		if (v !== undefined) pushValueToSpreadedRawData(stack, v);
		v = stack.pop()![0];
	}
	if (v === undefined) throw new Error("Empty stack");
	return v;
};

/**
 * Map between raw data type and codemirror grammar.
 */
export const DATA_TYPE_TO_GRAMMAR: { [key in DataType]: string } = {
	text: "text",
	json: "json",
	yaml: "yaml",
	"csv-with-headers": "csv",
	toml: "toml",
	"py-builtin": "python",
};
