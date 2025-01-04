// ref: https://knip.dev/reference/configuration

import type { KnipConfig } from "knip";

const config: KnipConfig = {
	ignoreBinaries: [
		// mise tools are not detected as binaries
		"semantic-release",
	],
	ignoreDependencies: [
		// cannot be detected automatically
		"@commitlint/cli",
		// referenced in resolved config of commitlint.config.ts but not a dependency
		// biome-ignore lint/nursery/noSecrets: false positive
		"conventional-changelog-conventionalcommits",
	],
	entry: ["src/bin.ts", "src/index.ts"],
	// mise tools are not recognized as plugins
	cspell: true,
};

export default config;
