# react-scad

Render JSX to **OpenSCAD** models using the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler).

- Write declarative 3D with React components; no imperative OpenSCAD scripting
- Compose shapes with familiar JSX; get `.scad` source for OpenSCAD or 3D printing
- Use the CLI to bundle and export in one go, with optional watch mode

### Quick Start

```bash
npx react-scad ./example/sandbox.jsx
```

With **watch** (rebuild on save):

```bash
npx react-scad ./example/sandbox.jsx --watch
```

Entry can be a `.jsx` or `.tsx` file. The CLI writes the `.scad` file to your current working directory.

## Install

Install the package and React (peer dependency):

```bash
npm install react react-scad
```

**Peer dependency:** `react` >= 18.

### Minimal example

```jsx
import { createRoot, Cube, Sphere, Union } from "react-scad";

const root = createRoot("model.scad");

root.render(
  <Union>
    <Cube size={[10, 10, 10]} center />
    <Sphere r={6} />
  </Union>
);
```

## API Reference

### `createRoot(path?)`

Creates a root. Pass a path (file path string) so `root.render()` writes the `.scad` file automatically.

- **`root.render(element)`** — Renders the React tree and writes the file (if `path` was set).
- **`root.toScad()`** — Returns the OpenSCAD source string.

### `createContainer()` / `render()` / `toScad()`

Lower-level API: create a container, render into it, then call `toScad(container)` to get the string. Use this when you don't want to write a file (e.g. in the browser or a custom pipeline).

### Primitives

| Component       | OpenSCAD         | Example props               |
| --------------- | ---------------- | --------------------------- |
| `Cube`          | `cube()`         | `size`, `center`            |
| `Sphere`        | `sphere()`       | `r`, `d`, `$fn`             |
| `Cylinder`      | `cylinder()`     | `h`, `r1`, `r2`, `$fn`      |
| `Union`         | `union()`        | children                    |
| `Difference`    | `difference()`   | children                    |
| `Intersection`  | `intersection()` | children                    |
| `Translate`     | `translate()`    | `v` (vector)                |
| `Rotate`        | `rotate()`       | `a` (angles), optional `v`  |
| `Scale`         | `scale()`        | `v` (vector)                |
| `Group`         | `{ }`            | children                    |

Prop names follow OpenSCAD where it makes sense (`r`, `h`, `size`, `center`, `$fn`, etc.).

### OpenSCAD coverage

Which OpenSCAD primitives and operations are implemented in react-scad:

| OpenSCAD | react-scad | Status |
| -------- | ---------- | ------ |
| **3D primitives** | | |
| `cube()` | `Cube` | ✅ Implemented |
| `sphere()` | `Sphere` | ✅ Implemented |
| `cylinder()` | `Cylinder` | ✅ Implemented |
| `polyhedron()` | — | ❌ Not implemented |
| **2D primitives** | | |
| `square()` | — | ❌ Not implemented |
| `circle()` | — | ❌ Not implemented |
| `polygon()` | — | ❌ Not implemented |
| **CSG** | | |
| `union()` | `Union` | ✅ Implemented |
| `difference()` | `Difference` | ✅ Implemented |
| `intersection()` | `Intersection` | ✅ Implemented |
| **Transforms** | | |
| `translate()` | `Translate` | ✅ Implemented |
| `rotate()` | `Rotate` | ✅ Implemented |
| `scale()` | `Scale` | ✅ Implemented |
| **2D → 3D** | | |
| `linear_extrude()` | — | ❌ Not implemented |
| `rotate_extrude()` | — | ❌ Not implemented |
| **Text** | | |
| `text()` | — | ❌ Not implemented |
| **Other** | | |
| `{ }` (group) | `Group` | ✅ Implemented |
| inline code | `Raw` | ✅ Implemented |
| `surface()` | — | ❌ Not implemented |
| `import()` | — | ❌ Not implemented |

## Why react-scad?

OpenSCAD is great for parametric 3D, but code is imperative and nesting gets messy. Composing modules and passing parameters can be tedious.

With react-scad you build a tree of SCAD primitives using React components. The reconciler runs with a custom host config that builds an internal SCAD tree (no DOM). Serialization turns that tree into OpenSCAD source.

**JSX → React tree → host config → SCAD tree → OpenSCAD source.**

You get declarative composition, reuse via components, and the same `.scad` output you’d use in OpenSCAD or slicers.

## Project structure

- **`src/types.ts`** — Shared types (node shapes, `Vec3`, `ScadExpr`, etc.). Used by runtime, primitives, and serialize.
- **`src/utils.ts`** — Shared helpers (e.g. `formatVec3` for serialization).
- **`src/primitives/`** — React components (Cube, Sphere, Union, …) and their per-node serializers.
- **`src/runtime/`** — React reconciler host config: React tree → ScadNode tree (create/update/clone, root, render).
- **`src/serialize/`** — ScadNode tree → OpenSCAD source string (`toScad`).

Public API is re-exported from `src/index.ts`.

## Development (from repo)

```bash
git clone <repo>
cd react-scad
npm install
npm run build
```

- **`npm run example:jsx`** — Run `example/sandbox.jsx` once.
- **`npm run dev`** — Watch `example/sandbox.jsx` and rebuild on change.
- **`npx react-scad ./path/to/entry.tsx`** — Run any entry file.
- **`npx react-scad ./path/to/entry.tsx --watch`** — Run with watch.

## License

MIT
