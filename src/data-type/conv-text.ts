import { RawData } from ".";
import { IDataConverter } from "./i-converter";

/**
 * Identity converter
 */
class TextConverter implements IDataConverter {
	get type() {
		return "text";
	}

	parse(data: string): RawData {
		return data;
	}

	stringify(data: RawData): string {
		if (typeof data === "string") return data;
		return JSON.stringify(data);
	}

	minify(data: RawData): string {
		return this.stringify(data);
	}
}

export const getTextConverter = (): IDataConverter => new TextConverter();
