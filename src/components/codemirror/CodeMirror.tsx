import { Component, createEffect, onCleanup, onMount } from "solid-js";

import { EditorView, basicSetup } from "codemirror";
import { keymap, ViewUpdate } from "@codemirror/view";
import { Compartment, EditorState } from "@codemirror/state";
import {
	LanguageSupport,
	StreamLanguage,
	StreamParser,
} from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";
import { dracula, rosePineDawn } from "thememirror";

// Code mirror helpers

const emptyParser = (name: string): StreamParser<unknown> => ({
	name,
	token: function (stream) {
		stream.eatWhile(/./);
		return null;
	},
});

const LOAD_LANG = new Map<
	string,
	() => Promise<StreamParser<unknown> | LanguageSupport>
>([
	["c", async () => (await import("@codemirror/legacy-modes/mode/clike")).c],
	["csv", async () => emptyParser("csv")],
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
		async () => (await import("@codemirror/lang-javascript")).javascript(),
	],
	[
		"json",
		async () => (await import("@codemirror/lang-javascript")).javascript(),
	],
	["lua", async () => (await import("@codemirror/legacy-modes/mode/lua")).lua],
	[
		"markdown",
		async () => (await import("@codemirror/lang-markdown")).markdown(),
	],
	[
		"python",
		async () => (await import("@codemirror/legacy-modes/mode/python")).python,
	],
	["text", async () => emptyParser("text")],
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

// Theme

const getTheme = (darkMode: boolean) => {
	return darkMode ? dracula : rosePineDawn;
};

// Main Component

type Props = {
	grammar: string;
	text: string;
	onChange: (text: string) => void;
};

const CodeMirror: Component<Props> = props => {
	let divRef: HTMLDivElement;

	let state: EditorState;
	let view: EditorView;

	let onEditTimeout: number | null = null;

	const langCompartment = new Compartment();
	const themeCompartment = new Compartment();

	const handleColorSchemeChange = (e: any) => {
		view.dispatch({
			effects: themeCompartment.reconfigure(getTheme(!!e.matches)),
		});
	};

	const wrapLang = (l: StreamParser<unknown> | LanguageSupport) => {
		if (l instanceof LanguageSupport) return l;
		else return StreamLanguage.define(l);
	};

	onMount(async () => {
		const lang = await LOAD_LANG.get(props.grammar)!();

		// Change theme based on color scheme
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
		prefersDark.addEventListener("change", handleColorSchemeChange);
		setTimeout(() => handleColorSchemeChange(prefersDark));

		// Create code mirror state and view

		state = EditorState.create({
			doc: props.text,
			extensions: [
				basicSetup,
				keymap.of([indentWithTab]),
				langCompartment.of(wrapLang(lang)),
				themeCompartment.of(getTheme(prefersDark.matches)),
				EditorView.updateListener.of((v: ViewUpdate) => {
					if (!v.docChanged) return;
					if (onEditTimeout) clearTimeout(onEditTimeout);
					onEditTimeout = setTimeout(() => {
						props.onChange(v.state.doc.toString());
					}, 1000);
				}),
			],
		});

		view = new EditorView({
			state: state!,
			parent: divRef!,
		});

		// Add on change listener
		view.contentDOM.addEventListener("blur", () => {
			props.onChange(view.state.doc.toString());
		});
	});

	onCleanup(() => {
		view?.destroy();
		window
			.matchMedia("(prefers-color-scheme: dark)")
			.removeEventListener("change", handleColorSchemeChange);
	});

	createEffect(async () => {
		const l = props.grammar;
		if (view && l) {
			const mod = await loadLanguageExtension(l);
			view.dispatch({
				effects: langCompartment.reconfigure(wrapLang(mod)),
			});
		}
	});

	createEffect(() => {
		const t = props.text;
		if (view && t) {
			const oldText = view.state.doc.toString();
			if (oldText === t) return;
			// Change text contents
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: t,
				},
			});
		}
	});

	return <div ref={divRef!} />;
};

export default CodeMirror;
