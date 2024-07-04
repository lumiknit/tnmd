// Vitest for conv-json.ts

import { expect, test } from "vitest";

import { getJSONConverter } from "./conv-json";
import { RawData } from ".";

const conv = getJSONConverter();

test("type", () => {
	expect(conv.type).toBe("json");
});

const parseMinTest = (name: string, data: string, expected: RawData) => {
	test("parse-min-" + name, () => {
		const parsed = conv.parse(data);
		expect(parsed).toEqual(expected);
		const minified = conv.minify(parsed);
		expect(minified).toBe(data);
	});
};

parseMinTest("null", "null", null);
parseMinTest("bool", "true", true);
parseMinTest("number", "123", 123);
parseMinTest("string", `"abc"`, "abc");
parseMinTest("array", "[1,2,3]", [1, 2, 3]);
parseMinTest(
	"object",
	`{"a":1,"b":2}`,
	new Map([
		["a", 1],
		["b", 2],
	]),
);
parseMinTest("deep", `[{"a":1,"b":2},[3,4,5],"hello, world!",{"c":{"d":6}}]`, [
	new Map([
		["a", 1],
		["b", 2],
	]),
	[3, 4, 5],
	"hello, world!",
	new Map([["c", new Map([["d", 6]])]]),
]);
