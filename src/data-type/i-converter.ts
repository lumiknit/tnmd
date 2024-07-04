import { RawData, StringKeyObject } from ".";

/**
 * Data serializer/deserializer.
 */
export interface IDataConverter {
	/**
	 * Data type.
	 */
	get type(): string;

	/**
	 * Parse the string data into a JSON-like object.
	 */
	parse: (data: string) => RawData;

	/**
	 * Stringify the JSON-like object into a string.
	 * This is human-readable formatted
	 */
	stringify: (data: RawData, options?: StringKeyObject) => string;

	/**
	 * Minify the JSON-like object into a string.
	 * This is not human-readable formatted
	 */
	minify: (data: RawData) => string;
}
