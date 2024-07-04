// Vitest for conv-toml.ts

import { expect, test } from "vitest";

import { getTOMLConverter } from "./conv-toml";
import { RawData } from ".";

const conv = getTOMLConverter();

test("type", () => {
	expect(conv.type).toBe("toml");
});

const parseTest = (name: string, data: string, expected: RawData) => {
	test("parse-" + name, () => {
		const parsed = conv.parse(data);
		expect(parsed).toEqual(expected);
	});
};

parseTest(
	"singleton",
	`
a = "Hello"`,
	new Map([["a", "Hello"]]),
);
parseTest(
	"nested1",
	`
[main]
a = "Hello"`,
	new Map([["main", new Map([["a", "Hello"]])]]),
);
parseTest(
	"nested2",
	`
[main]
a = "Hello"
b = 20`,
	new Map([
		[
			"main",
			new Map<string, RawData>([
				["a", "Hello"],
				["b", 20],
			]),
		],
	]),
);
parseTest(
	"array",
	`
[[test]]
a = "Hello"
b = 20
[[test]]
a = "World"
b = 30`,
	new Map([
		[
			"test",
			[
				new Map<string, RawData>([
					["a", "Hello"],
					["b", 20],
				]),
				new Map<string, RawData>([
					["a", "World"],
					["b", 30],
				]),
			],
		],
	]),
);
parseTest(
	"date",
	`
	date = 2021-01-01T00:00:00Z`,
	new Map([["date", "2021-01-01T00:00:00.000Z"]]),
);

const stringifyTest = (name: string, data: RawData, expected: string) => {
	test("stringify-" + name, () => {
		const str = conv.stringify(data);
		expect(str.trim()).toBe(expected.trim());
	});
};

stringifyTest("singleton", new Map([["a", "Hello"]]), `a = "Hello"`);
stringifyTest(
	"nested1",
	new Map([["main", new Map([["a", "Hello"]])]]),
	`
[main]
a = "Hello"`,
);
stringifyTest(
	"nested2",
	new Map([
		[
			"main",
			new Map<string, RawData>([
				["a", "Hello"],
				["b", 20],
			]),
		],
	]),
	`
[main]
a = "Hello"
b = 20`,
);
stringifyTest(
	"array",
	new Map([
		[
			"test",
			[
				new Map<string, RawData>([
					["a", "Hello"],
					["b", 20],
				]),
				new Map<string, RawData>([
					["a", "World"],
					["b", 30],
				]),
			],
		],
	]),
	`
[[test]]
a = "Hello"
b = 20

[[test]]
a = "World"
b = 30`,
);
