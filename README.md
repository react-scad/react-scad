# react-scad

**React-SCAD**: render JSX to OpenSCAD models using the React reconciler.

| Package | Description |
| -------- | ------------ |
| [**@react-scad/core**](./packages/react-scad) | Core library: React reconciler → SCAD tree → OpenSCAD source |
| [**@react-scad/cli**](./packages/cli) | CLI: build and run `.jsx`/`.tsx` entry files (esbuild + watch) |
| [**example-rocket**](./examples/rocket) | Example: rocket with animated rotation |

## Preview

![Example](./assets/example.gif)

*Rocket example with animated rotation.*

## Contributing

1. **Fork and clone** the repo, then install dependencies:
   ```bash
   git clone https://github.com/YOUR_USER/react-scad.git
   cd react-scad
   pnpm install
   ```

2. **Create a branch** for your change:
   ```bash
   git checkout -b fix/your-change
   ```

3. **Build and test** before committing:
   ```bash
   pnpm run build
   pnpm run dev          # optional: smoke-test the example
   ```

4. **Format and lint** (all code in the repo):
   ```bash
   pnpm run format
   pnpm run lint
   ```

5. **Open a PR** against `main` with a short description of the change. For bugs, reference the issue if one exists.

6. **Publishing** is done via GitHub Actions on push to `main`; no need to publish from a PR.

## License

MIT
