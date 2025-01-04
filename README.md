# 🧩 jschema-validator

**`jschema-validator`** is a CLI tool to validate JSON/JSONC/JSON5 files against JSON Schema in `$schema` field. Both URLs and local files are supported.

## 🛠️ Installation

```bash
bun add -d jschema-validator
```

```bash
npm install -D jschema-validator
```

### via [mise-en-place](https://mise.jdx.dev/)

```bash
mise use npm:jschema-validator
```

## ⚙️ Configuration

If you want to configure the [Ajv](https://ajv.js.org/) options per file, you can create a `jschema.config.ts` file in the root of your project.  
`ts`, `js`, `mjs`, `cjs`, `mts`, `cts`, `json`, `jsonc`, `json5`, `yaml`, `yml`, and `toml` config files are supported.

`jschema.config.ts`

```typescript
import type { Config } from "jschema-validator";

const config: Config = {
	// configure Ajv options per file
	"test.json": {
		unicodeRegExp: false,
	},
	// set `false` to disable validation for a file
	"test2.json": false,
};
export default config;
```

Some files have predefined configurations. See [src/config.ts](src/config.ts).

## 💻 Development

### Getting Started

Run the following commands to start development.

```bash
gh repo clone risu729/jschema-validator
cd jschema-validator
mise install
```

### Commit

To commit, run the following command.  
[commitizen](https://github.com/commitizen/cz-cli) will ask you to fill in the commit message.

```bash
mise run commit
# or to commit only staged files
mise run commit:staged
```

### Release

This package is released automatically by GitHub Actions using [semantic-release](https://github.com/semantic-release/semantic-release).  
`package.json#version` is not updated in git, but automatically updated and published to npm.

## 📜 License

MIT License
