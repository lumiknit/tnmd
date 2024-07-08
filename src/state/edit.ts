import { DataType, RawData } from "../data-type";

/** JS Script Action Data */
export type ScriptSet = {
	script: string;
	scriptWalk?: boolean;
};

export type LLMSet = {
	gptBaseURL: string;
	gptModel: string;
	gptKey: string;

	geminiModel: string;
	geminiKey: string;

	prompt: string;
};

/**
 * Current form edited state.
 */
export type EditSet = {
	/** Data type */
	type: DataType;

	/** Data */
	data: RawData;

	/** Raw string */
	str: string;

	script: ScriptSet;

	llm: LLMSet;
};

const EDIT_SET_NAME = "_tnmd_edit_set";

const openEditSetStore = () =>
	new Promise<IDBObjectStore>((resolve, reject) => {
		const db = indexedDB.open(EDIT_SET_NAME, 1);
		db.onerror = () => {
			reject(db.error);
		};
		db.onsuccess = () => {
			const s = db.result
				.transaction(EDIT_SET_NAME, "readwrite")
				.objectStore(EDIT_SET_NAME);
			resolve(s);
		};
		db.onupgradeneeded = () => {
			const s = db.result.createObjectStore(EDIT_SET_NAME);
			resolve(s);
		};
	});

export const loadInitEditSet: () => Promise<EditSet> = () =>
	new Promise((resolve, reject) => {
		openEditSetStore()
			.then(s => {
				const getting = s.get(EDIT_SET_NAME);
				getting.onsuccess = (v: any) => {
					const e = v.target.result;
					let editSet: EditSet = {
						type: "text",
						data: "",
						str: "",
						script: {
							script: "",
						},
						llm: {
							gptBaseURL: "https://api.openai.com",
							gptModel: "gpt-3.5-turbo",
							gptKey: "",
							geminiModel: "gemini-1.5-flash",
							geminiKey: "",
							prompt:
								`
You are a helpful assistant.
- User will give you a a data in format '((format))'
- You need to perform below processes, and return the data in format '((format))'
- You should only return the result. Do not print anything else.

Process:
						`.trim() + "\n\n",
						},
					};
					if (e !== undefined && typeof e === "object") {
						Object.assign(editSet, e);
					} else {
						s.put(editSet, EDIT_SET_NAME);
					}
					resolve(editSet);
				};
				getting.onerror = (e: any) => {
					reject(e);
				};
			})
			.catch(reject);
	});

export const storeEditSet = async (editSet: EditSet) => {
	const s = await openEditSetStore();
	s.put(editSet, EDIT_SET_NAME);
};
