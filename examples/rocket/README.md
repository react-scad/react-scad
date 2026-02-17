# Rocket example

Example [react-scad](../../packages/react-scad) project: a simple rocket built from primitives (cone, cylinder, fins) with an animated rotation.

## Run

From this directory:

```bash
pnpm run start    # build and run once
pnpm run dev      # watch mode (rebuild on save)
```

From the repo root:

```bash
pnpm run dev      # runs this example in watch mode
```

## Structure

- **main.tsx** – Entry: creates the SCAD root and renders the rocket with a `Translate` animation
- **constants.ts** – Dimensions and shared config
- **components/** – `RocketHead`, `RocketBody`, `RocketWings` (JSX components that map to OpenSCAD primitives)

Output: `model.scad` in the current working directory when you run the app.
