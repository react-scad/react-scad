# react-scad

Render JSX to **OpenSCAD** models using the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler).

- Write declarative 3D with React components; no imperative OpenSCAD scripting
- Compose shapes with familiar JSX; get `.scad` source for OpenSCAD or 3D printing
- Use [@react-scad/cli](../cli) via npx to build and run

## Preview

![Example](https://github.com/react-scad/react-scad/raw/main/assets/example.gif)

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

Use [@react-scad/cli](../cli) to run your entry file. The CLI bundles your code, runs it, and the root writes the `.scad` file into the **current working directory** (the directory from which you run the command).

One-off run:

```bash
npx @react-scad/cli run main.tsx
```

Watch mode (rebuild and run on save):

```bash
npx @react-scad/cli run main.tsx --watch
```

So if you run from `my-project/`, `model.scad` will appear in `my-project/model.scad`.

### View the result

- Open the generated `.scad` file in [OpenSCAD](https://openscad.org/) to preview, export STL, or tweak.
- Or import the `.scad` (or an exported STL) into your slicer for 3D printing.

### Using the API without the CLI

If you run your app with Node or another bundler (not the react-scad CLI), the same code works: `createRoot("model.scad")` will write the file to the current working directory when `root.render()` runs. You can also create a container with `createContainer()`, call `render(<Scene />, container)`, then get the SCAD string with `toScad(container)` and write or use it yourself.

## Primitives (OpenSCAD coverage)

All listed OpenSCAD primitives and operations are implemented. Prop names follow OpenSCAD where it makes sense (`r`, `h`, `size`, `center`, `$fn`, etc.).

| OpenSCAD | react-scad | Implemented |
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

OpenSCAD is great for parametric 3D, but code is imperative and nesting gets messy. Composing modules and passing parameters can be tedious.

With react-scad you build a tree of SCAD primitives using React components. The reconciler runs with a custom host config that builds an internal SCAD tree (no DOM). Serialization turns that tree into OpenSCAD source.

**JSX → React tree → host config → SCAD tree → OpenSCAD source.**

You get declarative composition, reuse via components, and the same `.scad` output you’d use in OpenSCAD or slicers.

## Acknowledgements

- [React](https://react.dev/) and the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler) for the rendering model that makes this approach possible.
- [OpenSCAD](https://openscad.org/) for the script-based CAD language and documentation.

## License

React SCAD is MIT-licensed open-source software by Leon Meka and 
contributors.
