import { Component, createSignal, For } from "solid-js";

import { DataState, execSetText } from "../../state";
import { TbSparkles } from "solid-icons/tb";
import toast from "solid-toast";

type Props = {
	z: DataState;
};

const GEMINI_MODELS = ["gemini-1.0-pro", "gemini-1.5-flash", "gemini-1.5-pro"];

const chatRequest = async (
	systemPrompt: string,
	userPrompt: string,
	apiKey: string,
	model: string,
): Promise<string> => {
	const textPart = (role: string, text: string) => ({
		role,
		parts: [{ text }],
	});
	const prompt = systemPrompt + "\n\nUser:\n" + userPrompt;

	const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
	const resp = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			contents: [textPart("user", prompt)],
		}),
	});
	if (!resp.ok) {
		throw new Error("Failed to openai request: " + (await resp.text()));
	}
	const data = await resp.json();
	return data.candidates[0].content.parts[0].text;
};

const ActionGeminiView: Component<Props> = props => {
	let promptRef: HTMLTextAreaElement;
	let apiKeyRef: HTMLInputElement;

	const handleRun = async () => {
		const format = props.z.d().type;
		const data = props.z.d().str;

		const prompt = promptRef.value.replace(/\(\(format\)\)/g, format);
		const apiKey = apiKeyRef.value;
		const model = props.z.d().llm.geminiModel;

		toast.promise(chatRequest(prompt, data, apiKey, model), {
			loading: "Requested to Google Gemini...",
			success: response => {
				execSetText(props.z, response, "runGemini");
				return <> Success! </>;
			},
			error: e => {
				console.error(e);
				return <> Gemini Error: {"" + e}</>;
			},
		});
	};

	return (
		<>
			<div class="form-floating mb-3">
				<textarea
					ref={promptRef!}
					class="form-control"
					placeholder="Prompt"
					style={{
						height: "10rem",
					}}
					onChange={e => {
						const value = e.currentTarget.value;
						props.z.updateD(d => ({
							...d,
							llm: {
								...d.llm,
								prompt: value,
							},
						}));
					}}>
					{props.z.d().llm.prompt}
				</textarea>
				<label>Prompt</label>
			</div>

			<small>
				You can find your API key here:{" "}
				<a href="https://aistudio.google.com/app/apikey" target="_blank">
					API Keys
				</a>
			</small>
			<div class="form-floating mb-3">
				<input
					ref={apiKeyRef!}
					type="text"
					class="form-control"
					placeholder="API Key"
					value={props.z.d().llm.geminiKey}
					onChange={e => {
						const value = e.currentTarget.value;
						props.z.updateD(d => ({
							...d,
							llm: {
								...d.llm,
								geminiKey: value,
							},
						}));
					}}
				/>
				<label>API Key</label>
			</div>

			<div class="form-floating mb-2">
				<select
					class="form-select"
					onChange={e => {
						const value = e.currentTarget.value;
						props.z.updateD(d => ({
							...d,
							llm: {
								...d.llm,
								geminiModel: value,
							},
						}));
					}}>
					<For each={GEMINI_MODELS}>
						{m => (
							<option value={m} selected={m === props.z.d().llm.geminiModel}>
								{m}
							</option>
						)}
					</For>
				</select>
				<label> Chat Model </label>
			</div>

			<button class="btn btn-primary" onClick={handleRun}>
				<TbSparkles /> Run
			</button>
		</>
	);
};

export default ActionGeminiView;
