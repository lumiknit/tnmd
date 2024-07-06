import { DataType, RawData } from "../data-type";

/**
 * Current data set of the application
 */
export type DataSet = {
	/** Data type */
	type: DataType;

	/** Data */
	data: RawData;

	/** Raw string */
	str: string;

	/** JS Script */
	script: string;

	/** Script executed for the data */
	scriptWalk?: boolean;
};
