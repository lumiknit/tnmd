import { Component, createEffect, onMount } from "solid-js";

import { EditorView, basicSetup } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { StreamLanguage } from "@codemirror/language";

const LOAD_LANG = new Map<string, () => Promise<any>>([
	["c", async () => (await import("@codemirror/legacy-modes/mode/clike")).c],
	[
		"cpp",
		async () => (await import("@codemirror/legacy-modes/mode/clike")).cpp,
	],
	["go", async () => (await import("@codemirror/legacy-modes/mode/go")).go],
	[
		"haskell",
		async () => (await import("@codemirror/legacy-modes/mode/haskell")).haskell,
	],
	[
		"javascript",
		async () =>
			(await import("@codemirror/legacy-modes/mode/javascript")).javascript,
	],
	[
		"json",
		async () => (await import("@codemirror/legacy-modes/mode/javascript")).json,
	],
	["lua", async () => (await import("@codemirror/legacy-modes/mode/lua")).lua],
	[
		"python",
		async () => (await import("@codemirror/legacy-modes/mode/python")).python,
	],
	[
		"toml",
		async () => (await import("@codemirror/legacy-modes/mode/toml")).toml,
	],
	["xml", async () => (await import("@codemirror/legacy-modes/mode/xml")).xml],
	[
		"yaml",
		async () => (await import("@codemirror/legacy-modes/mode/yaml")).yaml,
	],
]);

const loadLanguageExtension = async (lang: string) => {
	const getter = LOAD_LANG.get(lang);
	if (!getter) throw new Error(`Language ${lang} not supported`);
	return await getter();
};

export const LANGUAGES = Array.from(LOAD_LANG.keys());

type Props = {
	grammar: string;
	text: string;
	onChange: (text: string) => void;
};

const CodeMirror: Component<Props> = props => {
	let divRef: HTMLDivElement;
	let state: EditorState;
	let view: EditorView;

	const langCompartment = new Compartment();

	onMount(async () => {
		const lang = await LOAD_LANG.get(props.grammar)!();

		state = EditorState.create({
			doc: props.text,
			extensions: [basicSetup, langCompartment.of(StreamLanguage.define(lang))],
		});

		view = new EditorView({
			state: state!,
			parent: divRef!,
		});
	});

	createEffect(async () => {
		const l = props.grammar;
		if (view && l) {
			const mod = await loadLanguageExtension(l);
			view.dispatch({
				effects: langCompartment.reconfigure(StreamLanguage.define(mod)),
			});
		}
	});

	return <div ref={divRef!} />;
};

export default CodeMirror;
