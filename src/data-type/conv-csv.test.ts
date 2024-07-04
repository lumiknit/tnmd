// Vitest for conv-csv.ts

import { expect, test } from "vitest";

import { getCSVWithHeaderConverter } from "./conv-csv";
import { RawData } from ".";
import { parse } from "yaml";

const conv = getCSVWithHeaderConverter();

test("type", () => {
	expect(conv.type).toBe("csv-with-header");
});

const parseMinTest = (name: string, data: string, expected: RawData) => {
	test("parse-min-" + name, () => {
		const parsed = conv.parse(data);
		expect(parsed).toEqual(expected);
		const minified = conv.minify(parsed);
		expect(minified.trim()).toBe(data.trim());
	});
};

parseMinTest(
	"simple1",
	`
a,b
hello,world`,
	[
		new Map([
			["a", "hello"],
			["b", "world"],
		]),
	],
);
parseMinTest(
	"simple2",
	`
Name,Age,Test
John,20,30
"Ja, ne",25,40
"Rust ""C""",",",50`,
	[
		new Map<string, RawData>([
			["Name", "John"],
			["Age", "20"],
			["Test", "30"],
		]),
		new Map<string, RawData>([
			["Name", "Ja, ne"],
			["Age", "25"],
			["Test", "40"],
		]),
		new Map<string, RawData>([
			["Name", 'Rust "C"'],
			["Age", ","],
			["Test", "50"],
		]),
	],
);
