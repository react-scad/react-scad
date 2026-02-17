# @react-scad/cli

CLI for [react-scad](../react-scad): build and run `.jsx`/`.tsx` entry files with esbuild.

## Build (developers)

From this package or the repo root:

```bash
pnpm run build
```

## Usage

```bash
npx @react-scad/cli run <entry> [--watch]
```

- **entry** – Path to your `.jsx` or `.tsx` entry file (e.g. `main.tsx`)
- **--watch**, **-w** – Rebuild and run on file changes

Your project needs `react` and `@react-scad/core`; the CLI bundles and resolves them.

### Examples

One-off build and run:

```bash
npx @react-scad/cli run main.tsx
```

Watch mode (rebuild on save):

```bash
npx @react-scad/cli run main.tsx --watch
```

The CLI bundles your entry and dependencies (resolving `react-scad` / `@react-scad/core`), runs the script, and writes the `.scad` output to your current working directory.

## Commands

| Command | Description |
| ------- | ----------- |
| `run`, `r` | Build and run an entry file |
| `--help`, `-h` | Show help |
| `--version`, `-v` | Show version |

## License

MIT
