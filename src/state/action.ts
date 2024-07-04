/**
 * Change the data view.
 * More specifically, it will change the data type (json, etc.).
 */
export type ViewAction = {
	type: "view";
	old: string;
};
