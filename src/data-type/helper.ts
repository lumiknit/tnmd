import { RawData } from ".";

/**
 * Recursively convert any data to raw data
 * This will change
 * - object to Map
 */
export const convertAnyToRawData = (data: any): RawData => {
	const visited = new Set<any>();
	const f = (data: any): RawData => {
		if (visited.has(data)) {
			throw new Error("Circular reference detected");
		}
		visited.add(data);
		let ret = data;
		if (data && typeof data === "object") {
			if (Array.isArray(data)) {
				ret = data.map(f);
			} else if (data instanceof Date) {
				ret = data.toISOString();
			} else {
				ret = new Map(Object.entries(data).map(([k, v]) => [k, f(v)]));
			}
		}
		visited.delete(data);
		return ret;
	};
	return f(data);
};

export const convertRawDataToAny = (data: RawData): any => {
	const visited = new Set<RawData>();
	const f = (data: RawData): any => {
		if (visited.has(data)) {
			throw new Error("Circular reference detected");
		}
		visited.add(data);
		let ret: any = data;
		if (data && typeof data === "object") {
			if (Array.isArray(data)) {
				ret = data.map(f);
			} else {
				ret = Object.fromEntries(
					[...data.entries()].map(([k, v]) => [k, f(v)]),
				);
			}
		}
		visited.delete(data);
		return ret;
	};
	return f(data);
};

const _randString = () => Math.random().toString(36).substring(7);
const now = () => Date.now().toString(36);

export const randString = () => _randString() + "--" + now();

const escapeMap = new Map<string, string>([
	["\x00", "x00"],
	["\b", "b"],
	["\f", "f"],
	["\n", "n"],
	["\r", "r"],
	["\t", "t"],
	["\v", "v"],
	["\\", "\\"],
	['"', '"'],
	["'", "'"],
	["\x7f", "e"],
]);

const unescapeMap = new Map<string, string>(
	[...escapeMap].map(([k, v]) => [v, k]),
);

/**
 * Escape a string with backslash.
 */
export const escapeString = (s: string): string => {
	let t = "";
	for (let i = 0; i < s.length; i++) {
		const c = s[i];
		if (escapeMap.has(c)) {
			t += "\\" + escapeMap.get(c);
		} else if (c < " " || c == "\x7f") {
			t += "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0");
		} else {
			t += c;
		}
	}
	return t;
};

/**
 * Unescape a string with backslash.
 */
export const unescapeString = (s: string): string => {
	let t = "";
	let p = 0;
	while (p < s.length) {
		// Find the next escape character
		let esc = s.indexOf("\\", p);
		if (esc === -1) {
			t += s.slice(p);
			break;
		} else {
			t += s.slice(p, esc);
			const c = s[esc + 1];
			if (c === undefined) t += "\\";
			else if (unescapeMap.has(c)) t += unescapeMap.get(c);
			else if ("0" <= c && c <= "7") {
				// Dec
				const n = parseInt(s.slice(esc + 1, esc + 4), 8);
				t += String.fromCharCode(n);
				esc += 2;
			} else if (c === "x") {
				// Hex
				const n = parseInt(s.slice(esc + 2, esc + 4), 16);
				t += String.fromCharCode(n);
				esc += 2;
			} else if (c === "u") {
				// Unicode
				const n = parseInt(s.slice(esc + 2, esc + 6), 16);
				t += String.fromCharCode(n);
				esc += 4;
			} else {
				t += c;
			}
			p = esc + 2;
		}
	}
	return t;
};
