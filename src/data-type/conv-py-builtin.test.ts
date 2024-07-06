// Vitest for conv-json.ts

import { expect, test } from "vitest";

import { RawData } from ".";
import { getPyBuiltinConverter } from "./conv-py-builtin";

const conv = getPyBuiltinConverter();

test("type", () => {
	expect(conv.type).toBe("py-builtin");
});

const parseTest = (name: string, data: string, expected: RawData) => {
	test(
		"parse-" + name,
		() => {
			const d = conv.parse(data);
			expect(d).toEqual(expected);
		},
		{
			timeout: 500,
		},
	);
};

parseTest("null", "None", null);
parseTest("true", "  True ", true);
parseTest("false", "\n\tFalse ", false);
parseTest("num1", "42", 42);
parseTest("num2", "-35.2", -35.2);
parseTest("str1", `"abc"`, "abc");
parseTest("str2", ` \t\n  "Hello, world!\\n"\n`, "Hello, world!\n");
parseTest("arr1", ` [1, 2, True, None]`, [1, 2, true, null]);
parseTest(
	"arr2",
	`
	[4, true, '''Hello, world!
''', [False, 64, ], None]
`,
	[4, true, "Hello, world!\n", [false, 64], null],
);
parseTest(
	"dict1",
	`
{
	'a': 1,
	"b": False,
}
`,
	new Map<string, RawData>([
		["a", 1],
		["b", false],
	]),
);
parseTest(
	"complex",
	`
[
  "This is test\n",
	{
		'a': 1,
		"b": False,
		"my\tvalue": '''Hello, world!
''',
	},
	None,
]
	`,
	[
		"This is test\n",
		new Map<string, RawData>([
			["a", 1],
			["b", false],
			["my\tvalue", "Hello, world!\n"],
		]),
		null,
	],
);

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
