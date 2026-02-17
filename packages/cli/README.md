# @react-scad/cli

CLI for [react-scad](../react-scad): build and run `.jsx`/`.tsx` entry files with esbuild. Supports watch mode. Written in TypeScript.

## Build

From this package or the repo root:

```bash
pnpm run build
```

## Install

```bash
npm install @react-scad/cli @react-scad/react-scad react
```

## Usage

```bash
react-scad run <entry> [--watch]
```

- **entry** – Path to your `.jsx` or `.tsx` entry file (e.g. `main.tsx`)
- **--watch**, **-w** – Rebuild and run on file changes

### Examples

One-off build and run:

```bash
react-scad run main.tsx
```

Watch mode (rebuild on save):

```bash
react-scad run main.tsx --watch
```

The CLI bundles your entry and dependencies (resolving `react-scad` and `@react-scad/react-scad` to the installed library), runs the script, and writes the `.scad` output to your current working directory.

## Commands

| Command | Description |
| ------- | ----------- |
| `run`, `r` | Build and run an entry file |
| `--help`, `-h` | Show help |
| `--version`, `-v` | Show version |

## License

MIT
