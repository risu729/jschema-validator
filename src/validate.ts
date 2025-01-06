import { dirname, resolve } from "node:path";
import is from "@sindresorhus/is";
import type { AnySchemaObject, Options } from "ajv";
import _Ajv04 from "ajv-draft-04";
import _addFormats from "ajv-formats";
import { Ajv2019 } from "ajv/dist/2019.js";
import draft7MetaSchema from "ajv/dist/refs/json-schema-draft-07.json" with {
	type: "json",
};
import { consola } from "consola";

// cspell:ignore nodenext
// avoid type error when using moduleResolution: "nodenext"
// ref: https://github.com/ajv-validator/ajv/issues/2132
const Ajv04 = _Ajv04 as unknown as typeof _Ajv04.default;
const addFormats = _addFormats as unknown as typeof _addFormats.default;

const draft04ErrorMessage = "Draft-04 meta schema is not supported";

/**
 * Load a Meta Schema from a remote URI.
 * @param allowDraft04 Whether to allow loading draft-04 schema. Required to prevent infinite loop.
 * @returns Function to load a remote schema.
 * @throws {Error} If the schema cannot be fetched.
 * @throws {Error} If the schema is draft-04 and `allowDraft04` is `false`.
 */
const loadRemoteSchema =
	(allowDraft04: boolean) =>
	async (uri: string): Promise<AnySchemaObject> => {
		if (!allowDraft04 && uri === "http://json-schema.org/draft-04/schema") {
			// infinite loop occurs when loading draft-04 schema if it is not registered as meta schema
			// ref: https://github.com/ajv-validator/ajv/issues/1821
			throw new Error(draft04ErrorMessage);
		}
		const response = await fetch(uri);
		if (!response.ok) {
			throw new Error(`Failed to fetch schema from ${uri}`);
		}
		return response.json() as Promise<AnySchemaObject>;
	};

/**
 * Load a JSON Schema specified in the `$schema` field of the JSON object.
 * @param content JSON object.
 * @param path Absolute path to the JSON file containing the object.
 * @returns JSON Schema object. `undefined` if no schema is found.
 */
const loadSchema = async (
	content: object,
	path: string,
): Promise<AnySchemaObject | undefined> => {
	if (!("$schema" in content)) {
		consola.info(`$schema not found in ${path}`);
		return undefined;
	}
	const schema = content.$schema;
	if (!is.string(schema)) {
		throw new Error("$schema must be a string");
	}
	if (is.emptyStringOrWhitespace(schema)) {
		throw new Error("$schema cannot be empty");
	}
	if (is.urlString(schema)) {
		return await loadRemoteSchema(true)(schema);
	}
	return (
		await import(resolve(dirname(path), schema), {
			with: { type: "json" },
		})
	).default;
};

/**
 * Validate a JSON file against its JSON Schema.
 * @param content JSON content.
 * @param path Absolute path to the JSON file.
 * @param config Configuration for the JSON file.
 */
export const validate = async (
	content: object,
	path: string,
	config: Options | undefined = {},
): Promise<void> => {
	const schema = await loadSchema(content, path);
	if (!schema) {
		return;
	}

	// use draft-2019-09, draft-2020-12, and draft-07 meta schemas by default
	// ref: https://ajv.js.org/guide/schema-language.html#draft-2019-09-and-draft-2020-12
	const ajv = new Ajv2019({
		strict: false,
		// latest version of ajv does not support draft-04 meta schema
		loadSchema: loadRemoteSchema(false),
		...config,
	});
	ajv.addMetaSchema(draft7MetaSchema);
	// add formats not included by default
	addFormats(ajv);

	try {
		const validateSchema = await ajv.compileAsync(schema);
		if (!validateSchema(content)) {
			throw new Error(ajv.errorsText(validateSchema.errors));
		}
	} catch (error) {
		if (!(is.error(error) && error.message === draft04ErrorMessage)) {
			throw error;
		}

		// fallback to ajv-draft-04 if draft-04 meta schema is used
		const ajv = new Ajv04({
			strict: false,
			loadSchema: loadRemoteSchema(true),
			...config,
		});
		// add formats not included by default
		addFormats(ajv);
		const validate = await ajv.compileAsync(schema);
		if (!validate(content)) {
			throw new Error(ajv.errorsText(validate.errors));
		}
	}

	consola.info(`Validation successful for ${path}`);
};
