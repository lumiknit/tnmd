import { RawData } from ".";
import { IDataConverter } from "./i-converter";

class CSVWithHeaderConverter implements IDataConverter {
	get type() {
		return "csv-with-headers";
	}

	parse(data: string): RawData {
		let p = 0;
		const lines = [];
		let line: RawData[] = [];
		while (p < data.length) {
			// If new line, push the line to lines
			if (data[p] === "\n") {
				if (line.length > 0) {
					lines.push(line);
					line = [];
				}
				p++;
				continue;
			}

			if (data[p] === '"') {
				const s = ++p;
				// Parse string
				while (p < data.length) {
					if (data[p] === '"') {
						if (data[p + 1] === '"') {
							p++;
						} else {
							break;
						}
					}
					p++;
				}
				line.push(data.slice(s, p).replace(/""/g, '"'));
				// Skip quote
				if (data[p] === '"') p++;
			} else {
				const s = p;
				// Parse until next comma or new line
				while (p < data.length && data[p] !== "\n" && data[p] !== ",") {
					p++;
				}
				line.push(data.slice(s, p).trim());
			}
			// Skip comma
			if (data[p] === ",") {
				p++;
			}
		}
		if (line.length > 0) {
			lines.push(line);
		}
		// Convert to Map
		const result = [];
		const keys = lines[0].map(v => "" + v);
		for (let i = 1; i < lines.length; i++) {
			const row = new Map();
			for (let j = 0; j < keys.length; j++) {
				row.set(keys[j], lines[i][j]);
			}
			result.push(row);
		}
		return result;
	}

	stringify(data: RawData): string {
		// Only Map[] is allowed
		// Check type
		if (!Array.isArray(data)) {
			throw new Error("Data must be an array");
		}
		// Find keys
		const keys = new Set<string>();
		for (const row of data) {
			if (!(row instanceof Map)) {
				throw new Error("Data must be an array of Map");
			}
			for (const key of row.keys()) {
				keys.add(key);
			}
		}
		const dataToCell = (data: any): string => {
			if (data === null || data === undefined) {
				return "";
			}
			if (typeof data !== "string") {
				data = JSON.stringify(data);
			}
			// Check if the string should be escaped
			return data.search(/[\n",]/) !== -1
				? `"${data.replace(/"/g, '""')}"`
				: data;
		};

		const lines = [];

		const keyArray = Array.from(keys);
		// Generate header
		lines.push(keyArray.map(dataToCell).join(","));
		// Generate rows
		for (const row of data) {
			lines.push(
				keyArray
					.map(key => dataToCell((row as Map<string, RawData>).get(key)))
					.join(","),
			);
		}
		return lines.join("\n");
	}

	minify(data: RawData): string {
		return this.stringify(data);
	}
}

export const getCSVWithHeaderConverter = (): IDataConverter =>
	new CSVWithHeaderConverter();
