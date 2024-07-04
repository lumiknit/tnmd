import { RawData } from ".";
import { IDataConverter } from "./i-converter";

class JSONConverter implements IDataConverter {
	get type() {
		return "json";
	}

	parse(data: string): RawData {
		// Parse json with JSON.parse
		return JSON.parse(data, (_, v) =>
			v && typeof v === "object" && !Array.isArray(v)
				? new Map(Object.entries(v))
				: v,
		);
	}

	stringify(data: RawData): string {
		return JSON.stringify(
			data,
			(_, v) => (v instanceof Map ? Object.fromEntries(v) : v),
			2,
		);
	}

	minify(data: RawData): string {
		return JSON.stringify(data, (_, v) =>
			v instanceof Map ? Object.fromEntries(v) : v,
		);
	}
}

export const getJSONConverter = (): IDataConverter => new JSONConverter();
