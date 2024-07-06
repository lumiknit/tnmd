import yaml from "yaml";

import { pushValueToSpreadedRawData, RawData, reduceSpreadedRawData } from ".";
import { IDataConverter } from "./i-converter";
import { randString, unescapeString } from "./helper";
import { Parser } from "./parser";

const pyBulitinReplacer = (rnd: string) => (_: string, value: any) => {
	switch (value) {
		case null:
			return rnd + "None";
		case true:
			return rnd + "True";
		case false:
			return rnd + "False";
		default:
			return value instanceof Map ? Object.fromEntries(value) : value;
	}
};

class PyBuiltinConverter implements IDataConverter {
	get type() {
		return "py-builtin";
	}

	parse(data: string): RawData {
		const p = new Parser(data);
		const stack: ([RawData[], number] | [Map<string, RawData>, string])[] = [];

		let v: RawData | undefined;

		// Parse the data
		for (;;) {
			p.checkProgress();

			p.skipWhitespace();
			if (p.isEOF()) {
				break;
			}
			const c = p.peek();
			switch (c) {
				case "#":
					p.eatUntil(/\n/);
					p.skipWhitespace();
					break;
				case "'":
				case '"':
				case "`":
					{
						// Find the end of the string
						const tri = c.repeat(3);
						const quote = tri === p.peek(3) ? tri : c;
						p.skip(quote.length);
						p.save();
						const reNonQuote = new RegExp(`[${quote}\\\\]`, "g");
						while (!p.isEOF() && !p.equal(quote)) {
							p.eatUntil(reNonQuote);
							if (p.peek() === "\\") {
								p.skip(2);
							}
						}
						if (p.isEOF()) {
							p.raiseError("Unexpected EOF, expected closing quote");
						}
						v = unescapeString(p.fin());
						p.skip(quote.length);
					}
					break;
				case "[":
				case "{":
					if (v !== undefined) {
						p.raiseError(`Unexpected ${c}, expect closing, ',', or ':'`);
					}
					stack.push(c === "[" ? [[], 0] : [new Map(), ""]);
					p.skip(1);
					break;
				case "]":
				case "}":
					if (stack.length === 0) {
						p.raiseError(`Unexpected ${c}, there was no array opening`);
					} else if (
						(c === "]") !==
						Array.isArray(stack[stack.length - 1][0])
					) {
						p.raiseError(`Unexpected ${c}, expect ${c === "]" ? "}" : "]"}`);
					}
					if (v !== undefined) {
						pushValueToSpreadedRawData(stack, v);
					}
					v = stack.pop()![0];
					p.skip(1);
					break;
				case ":":
					if (stack.length === 0) {
						p.raiseError("Unexpected ':', no dictionary opening found");
					} else if (stack[stack.length - 1][1] !== "") {
						p.raiseError(
							`Unexpected : after key '${stack[stack.length - 1][1]}', expect ','`,
						);
					} else if (typeof v !== "string") {
						p.raiseError("Key must be string");
					} else {
						stack[stack.length - 1][1] = v;
						v = undefined;
						p.skip(1);
					}
					break;
				case ",":
					if (stack.length === 0) {
						p.raiseError(
							"Unexpected ',', no array or dictionary opening found",
						);
					} else if (v !== undefined) {
						pushValueToSpreadedRawData(stack, v);
						v = undefined;
					}
					p.skip(1);
					break;
				default:
					if (p.eatString("None")) {
						v = null;
					} else if (p.eatString("True")) {
						v = true;
					} else if (p.eatString("False")) {
						v = false;
					} else {
						// Parse as number
						const num = p.eat(/[-+a-zA-Z0-9._]+/y);
						if (num === undefined) {
							return p.raiseError(`Unexpected '${c}', expected number`);
						}
						try {
							v = JSON.parse(num);
						} catch {
							p.raiseError(`Invalid number format: ${num}`);
						}
					}
			}
			p.skipWhitespace();
		}

		// Pack all stack into one
		v = reduceSpreadedRawData(stack, v);
		return v;
	}

	stringify(data: RawData): string {
		const j = JSON.stringify(data);
		// Find string not included in json
		let s = randString();
		while (j.includes(s)) {
			s += randString();
		}
		const out = JSON.stringify(data, pyBulitinReplacer(s), 4);
		// Replace `"s` + `"` with `s`
		return out.replace(new RegExp(`"${s}([^"]*)"`), "$1");
	}

	minify(data: RawData): string {
		const j = JSON.stringify(data);
		// Find string not included in json
		let s = randString();
		while (j.includes(s)) {
			s += randString();
		}
		const out = JSON.stringify(data, pyBulitinReplacer(s));
		// Replace `"s` + `"` with `s`
		return out.replace(new RegExp(`"${s}([^"]*)"`), "$1");
	}
}

export const getPyBuiltinConverter = (): IDataConverter =>
	new PyBuiltinConverter();
