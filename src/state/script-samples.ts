type ScriptSample = {
	name: string;
	code: string;
	walk?: boolean;
};

export const SCRIPT_SAMPLES: ScriptSample[] = [
	{
		name: "sum-of-array",
		code: `(arr) => arr.reduce((a, b) => a + b, 0)`,
	},
	{
		name: "fibonacci",
		code: `
n => {
  let a = 0, b = 1;
	for (let i = 0; i < n; i++) {
		[a, b] = [b, a + b];
	}
	return a;
}`.trim(),
	},
	{
		name: "string-to-length",
		code: `(s) => (typeof s === "string" ? s.length : s)`,
		walk: true,
	},
];
