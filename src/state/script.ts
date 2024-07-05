type Outputs = {
	outputs: string[];
};

/** Create console-like object */
const createConsole = (out: Outputs) => {
	const log = (...args: any[]) => {
		out.outputs.push(args.join(" "));
	};

	return {
		log,
	};
};

type ExecutionResult = {
	outputs: string[];
	result?: any;
	error?: any;
};

/**
 * Execute javascript, which is a function takes single argument.
 */
export const executeScript = (script: string, arg: any): ExecutionResult => {
	const outputs = {
		outputs: [],
	};
	const c = createConsole(outputs);
	try {
		// Create a function with script, with argument 'console'
		const f = new Function("console", "return(" + script.trim() + ")");
		const res = f(c)(arg);
		return {
			outputs: outputs.outputs,
			result: res,
		};
	} catch (e) {
		console.error(e);
		return {
			outputs: outputs.outputs,
			error: e,
		};
	}
};
