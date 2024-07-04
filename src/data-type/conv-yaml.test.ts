// Vitest for conv-json.ts

import { expect, test } from "vitest";

import { getYAMLConverter } from "./conv-yaml";
import { RawData } from ".";

const conv = getYAMLConverter();

test("type", () => {
	expect(conv.type).toBe("yaml");
});

const parseMinTest = (name: string, data: string, expected: RawData) => {
	test("parse-min-" + name, () => {
		const parsed = conv.parse(data);
		expect(parsed).toEqual(expected);
		const minified = conv.minify(parsed);
		expect(minified.trim()).toBe(data.trim());
	});
};

parseMinTest("null", `null`, null);
parseMinTest("bool", `true`, true);
parseMinTest("number", `123`, 123);
parseMinTest("string", `abc`, "abc");
parseMinTest(
	"object",
	`
a: 20
b: 30`,
	new Map([
		["a", 20],
		["b", 30],
	]),
);
parseMinTest(
	"array",
	`
- test
- 20`,
	["test", 20],
);
parseMinTest(
	"deep",
	`
- a: 20
  b: 30
- - 20
  - 30
- test
- c:
    d: 40`,
	[
		new Map([
			["a", 20],
			["b", 30],
		]),
		[20, 30],
		"test",
		new Map([["c", new Map([["d", 40]])]]),
	],
);
