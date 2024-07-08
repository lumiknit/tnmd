import { Component, createSignal, For } from "solid-js";

import { DataState, execSetText } from "../../state";
import { TbSparkles } from "solid-icons/tb";
import toast from "solid-toast";

type Props = {
	z: DataState;
};

const DEFAULT_OPENAI_BASE_URL = "https://api.openai.com";
const GPT_MODELS = ["gpt-3.5-turbo", "gpt-4-turbo", "gpr-4o"];

const chatRequest = async (
	systemPrompt: string,
	userPrompt: string,
	apiKey: string,
	baseUrl: string,
	model: string,
): Promise<string> => {
	const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model,
			messages: [
				{
					role: "system",
					content: systemPrompt,
				},
				{
					role: "user",
					content: userPrompt,
				},
			],
		}),
	});
	if (!resp.ok) {
		throw new Error("Failed to openai request: " + (await resp.text()));
	}
	const data = await resp.json();
	return data.choices[0].message.content;
};

const ActionGPTView: Component<Props> = props => {
	let promptRef: HTMLTextAreaElement;
	let apiKeyRef: HTMLInputElement;
	let baseUrlRef: HTMLInputElement;

	const handleRun = async () => {
		const format = props.z.d().type;
		const data = props.z.d().str;

		const prompt = promptRef.value.replace(/\(\(format\)\)/g, format);
		const apiKey = apiKeyRef.value;
		const baseUrl = baseUrlRef.value || DEFAULT_OPENAI_BASE_URL;
		const model = props.z.d().llm.gptModel;

		toast.promise(chatRequest(prompt, data, apiKey, baseUrl, model), {
			loading: "Requested to OpenAI...",
			success: response => {
				execSetText(props.z, response, "runGPT");
				return <> Success! </>;
			},
			error: e => {
				console.error(e);
				return <> OpenAI Error: {"" + e}</>;
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

			<div class="form-floating mb-3">
				<input
					ref={baseUrlRef!}
					type="text"
					class="form-control"
					placeholder="Base URL"
					value={props.z.d().llm.gptBaseURL}
					onChange={e => {
						const value = e.currentTarget.value;
						props.z.updateD(d => ({
							...d,
							llm: {
								...d.llm,
								gptBaseURL: value,
							},
						}));
					}}
				/>
				<label>Base URL (Default is {DEFAULT_OPENAI_BASE_URL})</label>
			</div>

			<small>
				You can find your API key here:{" "}
				<a href="https://platform.openai.com/api-keys" target="_blank">
					API Keys
				</a>
			</small>
			<div class="form-floating mb-3">
				<input
					ref={apiKeyRef!}
					type="text"
					class="form-control"
					placeholder="API Key"
					value={props.z.d().llm.gptKey}
					onChange={e => {
						const value = e.currentTarget.value;
						props.z.updateD(d => ({
							...d,
							llm: {
								...d.llm,
								gptKey: value,
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
								gptModel: value,
							},
						}));
					}}>
					<For each={GPT_MODELS}>
						{m => (
							<option value={m} selected={m === props.z.d().llm.gptModel}>
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

export default ActionGPTView;
