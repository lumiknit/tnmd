import { stringify, parse } from "smol-toml";

import { RawData } from ".";
import { IDataConverter } from "./i-converter";
import { convertAnyToRawData, convertRawDataToAny } from "./helper";

class TOMLConverter implements IDataConverter {
	get type() {
		return "toml";
	}

	parse(data: string): RawData {
		const parsed = parse(data);
		return convertAnyToRawData(parsed);
	}

	stringify(data: RawData): string {
		const a = convertRawDataToAny(data);
		return stringify(a);
	}

	minify(data: RawData): string {
		const a = convertRawDataToAny(data);
		return stringify(a);
	}
}

export const getTOMLConverter = (): IDataConverter => new TOMLConverter();
