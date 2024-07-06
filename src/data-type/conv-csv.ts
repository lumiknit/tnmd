import { RawData } from ".";
import { IDataConverter } from "./i-converter";
import { Parser } from "./parser";

class CSVWithHeaderConverter implements IDataConverter {
	get type() {
		return "csv-with-headers";
	}

	parse(data: string): RawData {
		const p = new Parser(data);
		const lines = [];
		let line: RawData[] = [];
		while (!p.isEOF()) {
			p.checkProgress();
			switch (p.peek()) {
				// If new line, push the line to lines
				case "\n":
					{
						if (line.length > 0) {
							lines.push(line);
							line = [];
						}
						p.skip(1);
					}
					break;
				// If quote, parse as string
				case '"':
					{
						// Parse string
						p.skip(1);
						p.save();
						while (!p.isEOF()) {
							if (p.equal('""')) {
								p.skip(2);
							} else if (p.equal('"')) {
								break;
							} else {
								p.skip(1);
							}
						}
						line.push(p.fin().replace(/""/g, '"'));
						p.eatString('"');
					}
					break;
				default: {
					const v = p.eatUntil(/[\n,"]/g);
					if (v !== undefined) line.push(v);
				}
			}
			p.eatString(",");
		}
		if (line.length > 0) {
			lines.push(line);
		}
		// Convert to Map
		const keys = lines[0].map(v => "" + v);
		return lines.slice(1).map(row => new Map(keys.map((k, j) => [k, row[j]])));
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
