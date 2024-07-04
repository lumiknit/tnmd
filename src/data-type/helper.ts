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

export const randString = () => Math.random().toString(36).substring(7);
