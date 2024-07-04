import yaml from "yaml";

import { RawData } from ".";
import { IDataConverter } from "./i-converter";

class YAMLConverter implements IDataConverter {
	get type() {
		return "yaml";
	}

	parse(data: string): RawData {
		return yaml.parse(data, (_, v) =>
			v && typeof v === "object" && !Array.isArray(v)
				? new Map(Object.entries(v))
				: v,
		);
	}

	stringify(data: RawData): string {
		return yaml.stringify(
			data,
			(_, v) => (v instanceof Map ? Object.fromEntries(v) : v),
			2,
		);
	}

	minify(data: RawData): string {
		return yaml.stringify(data, (_, v) =>
			v instanceof Map ? Object.fromEntries(v) : v,
		);
	}
}

export const getYAMLConverter = (): IDataConverter => new YAMLConverter();
