// Vitest for conv-json.ts

import { expect, test } from "vitest";

import { RawData } from ".";
import { getPyBuiltinConverter } from "./conv-py-builtin";

const conv = getPyBuiltinConverter();

test("type", () => {
	expect(conv.type).toBe("py-builtin");
});

const minifyTest = (name: string, data: RawData, expected: string) => {
	test("minify-" + name, () => {
		const str = conv.minify(data);
		expect(str).toBe(expected);
	});
};

minifyTest("null", null, "None");
minifyTest("bool", true, "True");
minifyTest("number", 123, "123");
minifyTest("string", "abc", `"abc"`);
minifyTest("array", [1, 2, 3], "[1,2,3]");
minifyTest(
	"object",
	new Map([
		["a", 1],
		["b", 2],
	]),
	`{"a":1,"b":2}`,
);
