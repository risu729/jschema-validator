#!/usr/bin/env node

import { resolve } from "node:path";
import { cwd, exit } from "node:process";
import is from "@sindresorhus/is";
import { consola } from "consola";
import meow from "meow";
import { loadConfig } from "./config.js";
import { readJsonFile, walk } from "./file.js";
import { validate } from "./validate.js";

const rootDir = cwd();

meow(
	`
	\u001b[1mJSON Schema Validator\u001b[22m
	Validate JSON schema set as \`$schema\` in JSON/JSONC/JSON5 files.

	Usage
		$ jschema-validator [options]

	Options
		--help     Show help
		--version  Show version
`,
	{
		importMeta: import.meta,
	},
);

const config = await loadConfig(rootDir);

const files = await walk(rootDir);

const results = await Promise.all(
	files.map(async (file): Promise<boolean> => {
		const fileConfig = config[file];
		if (fileConfig === false) {
			consola.info(`Validation disabled for ${file}`);
			return true;
		}
		const path = resolve(rootDir, file);
		try {
			const content = await readJsonFile(path);
			await validate(content, path, fileConfig);
		} catch (error) {
			consola.error(`Error validating ${file}\n`, error);
			return false;
		}
		return true;
	}),
);

exit(is.array(results, (result) => result === true) ? 0 : 1);
