import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import ignoreWalk from "ignore-walk";
import json5 from "json5";
import { parse as parseJsonc } from "jsonc-parser";

// cannot use named import because json5 is commonjs
const { parse: parseJson5 } = json5;

const extensions = ["json", "jsonc", "json5"].map((ext) => `.${ext}`);

/**
 * Walk through the directory and return all JSON files.
 * @param rootDir Root directory to start walking.
 * @returns Array of JSON file paths relative to the root directory.
 */
export const walk = async (rootDir: string): Promise<string[]> => {
	const files = await ignoreWalk({
		path: rootDir,
		ignoreFiles: [".gitignore"],
	});
	return (
		files
			// ignore-walk doesn't ignore .git directory
			// ref: https://github.com/npm/ignore-walk/issues/2
			.filter((path) => !path.startsWith(".git"))
			.filter((path) => extensions.includes(extname(path)))
	);
};

/**
 * Read a JSON/JSONC/JSON5 file and return the parsed object.
 * @param path Absolute path to the JSON file.
 * @returns Parsed JSON object.
 */
export const readJsonFile = async (path: string): Promise<object> => {
	const extension = extname(path);
	if (extension === ".json") {
		try {
			return await import(path, {
				with: { type: "json" },
			});
		} catch {
			// fallback to jsonc
		}
	}
	const text = await readFile(path, "utf-8");
	if (extension === ".json5") {
		return parseJson5(text);
	}
	return parseJsonc(text);
};
