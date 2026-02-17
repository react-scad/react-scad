# react-scad

Render JSX to **SCAD** models using the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler).

- Write declarative 3D with React components; no imperative SCAD scripting
- Compose shapes with familiar JSX; get `.scad` source for OpenSCAD or 3D printing
- Run `.tsx` entry files with [tsx](https://github.com/privatenumber/tsx) (e.g. `npx tsx main.tsx`)

## Preview

![Example](./assets/example.gif)

*Rocket example with animated rotation.*

## Getting Started

### Prerequisites

- **Node.js** 18+
- **React** 18 or later (peer dependency)

### Install

```bash
npm install react @react-scad/core
```

With pnpm or yarn:

```bash
pnpm add react @react-scad/core
# or
yarn add react @react-scad/core
```

### How it works

Call `createRoot("model.scad")` with the filename you want. Then call `root.render(<YourScene />)` with your JSX. Each time you render, react-scad turns that scene into SCAD code and writes it to the file.

### Minimal example

Create a file `main.tsx` (or `main.jsx`):

```jsx
import { createRoot, Cube, Sphere, Union } from "@react-scad/core";

// Output path: the .scad file that will be written (relative to cwd when run)
const root = createRoot("model.scad");

root.render(
  <Union>
    <Cube size={[10, 10, 10]} center />
    <Sphere r={6} />
  </Union>
);
```

- `createRoot("model.scad")` — creates a root that writes to `model.scad`.
- `Union` — CSG union of all children (like `union()` in SCAD).
- `Cube` / `Sphere` — props match SCAD: `size`, `center`, `r`, `$fn`, etc.

### Run and write the `.scad` file

Run your entry file with [tsx](https://github.com/privatenumber/tsx) so Node can execute the `.tsx`. The `.scad` file is written to the **current working directory** when you call `root.render()`.

```bash
npx tsx main.tsx
```

Watch mode (re-run on save):

```bash
npx tsx watch main.tsx
```

Run from the directory that contains `main.tsx` (or use the path to it). The output path you passed to `createRoot()` is relative to the current working directory.

### View the result

- Open the generated `.scad` file in [OpenSCAD](https://openscad.org/) to preview, export STL, or tweak.
- Or import the `.scad` (or an exported STL) into your slicer for 3D printing.

### Controlling output (custom path or in-memory)

To write to a custom path or get the SCAD string in memory instead of using `createRoot(path)`, use a container and `toScad`:

```jsx
import { createContainer, render, toScad, Cube, Sphere, Union } from "@react-scad/core";
import { writeFileSync } from "fs";

const container = createContainer();
render(
  <Union>
    <Cube size={[10, 10, 10]} center />
    <Sphere r={6} />
  </Union>,
  container
);

const scadCode = toScad(container);
writeFileSync("out/model.scad", scadCode);
// or use scadCode however you like
```

Node doesn't run `.tsx` by itself. Use **tsx** (recommended) or bundle with esbuild and run with Node:

```bash
npx tsx main.tsx
# or
npx esbuild main.tsx --bundle --platform=node --outfile=run.js && node run.js
```

## Primitives (SCAD coverage)

All listed SCAD primitives and operations are implemented. Prop names follow SCAD where it makes sense (`r`, `h`, `size`, `center`, `$fn`, etc.).

| SCAD | react-scad | Implemented |
| -------- | ---------- | :---------: |
| **3D primitives** | | |
| `cube()` | `Cube` | ✓ |
| `sphere()` | `Sphere` | ✓ |
| `cylinder()` | `Cylinder` | ✓ |
| `polyhedron()` | `Polyhedron` | ✓ |
| **2D primitives** | | |
| `square()` | `Square` | ✓ |
| `circle()` | `Circle` | ✓ |
| `polygon()` | `Polygon` | ✓ |
| **CSG** | | |
| `union()` | `Union` | ✓ |
| `difference()` | `Difference` | ✓ |
| `intersection()` | `Intersection` | ✓ |
| **Transforms** | | |
| `translate()` | `Translate` | ✓ |
| `rotate()` | `Rotate` | ✓ |
| `scale()` | `Scale` | ✓ |
| **2D → 3D** | | |
| `linear_extrude()` | `LinearExtrude` | ✓ |
| `rotate_extrude()` | `RotateExtrude` | ✓ |
| **Text** | | |
| `text()` | `Text` | ✓ |
| **Other** | | |
| `{ }` (group) | `Group` | ✓ |
| inline code | `Raw` | ✓ |
| `surface()` | `Surface` | ✓ |
| `import()` | `Import` | ✓ |

## Why react-scad?

OpenSCAD is great for parametric 3D, but SCAD code is imperative and nesting gets messy. Composing modules and passing parameters can be tedious.

With react-scad you build a tree of SCAD primitives using React components. The reconciler runs with a custom host config that builds an internal SCAD tree (no DOM). Serialization turns that tree into SCAD source.

**JSX → React tree → host config → SCAD tree → SCAD source.**

You get declarative composition, reuse via components, and the same `.scad` output you'd use in OpenSCAD or slicers.

## Example

The [rocket example](./examples/rocket) shows a simple model with animated rotation. From the repo root:

```bash
pnpm run dev          # watch mode
pnpm run start        # one-off run
```

Or from `examples/rocket`: `npx tsx main.tsx` or `npx tsx watch main.tsx`.

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

## Acknowledgements

- [React](https://react.dev/) and the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler) for the rendering model that makes this approach possible.
- [OpenSCAD](https://openscad.org/) for the SCAD language and documentation.

## License

MIT © Leon Meka and contributors.
