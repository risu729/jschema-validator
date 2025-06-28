// ref: https://cspell.org/docs/Configuration

"use strict";

/**
 * @type {import("@cspell/cspell-types").CSpellUserSettings}
 */
module.exports = {
	dictionaries: ["typescript", "node", "npm", "bash", "markdown"],
	enableGlobDot: true,
	ignorePaths: [
		".git/",
		// ignore auto-generated files
		".gitignore",
		"bun.lock",
		// ignore license files
		"LICENSE",
	],
	language: "en",
	useGitignore: true,
	version: "0.2",
	words: [
		"jschema",
		"risu",
		"biomejs",
		"taplo",
		"yamlfmt",
		"ghalint",
		"pinact",
		"commitlint",
		"sindresorhus",
		"buni",
	],
};
