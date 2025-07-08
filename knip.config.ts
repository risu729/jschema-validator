// ref: https://knip.dev/reference/configuration

import type { KnipConfig } from "knip";

const config: KnipConfig = {
	// mise tools are not recognized as plugins
	cspell: true,
	entry: ["src/bin.ts", "src/index.ts"],
	ignoreBinaries: [
		// mise tools are not detected as binaries
		"semantic-release",
	],
	ignoreDependencies: [
		// cannot be detected automatically
		"@commitlint/cli",
		// referenced in resolved config of commitlint.config.ts but not a dependency
		"conventional-changelog-conventionalcommits",
	],
};

export default config;
