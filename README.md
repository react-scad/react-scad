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

Install the package and React:

```bash
npm install react react-scad
```

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

## Primitives (OpenSCAD coverage)

All listed OpenSCAD primitives and operations are implemented. Prop names follow OpenSCAD where it makes sense (`r`, `h`, `size`, `center`, `$fn`, etc.).

| OpenSCAD | react-scad | Example props |
| -------- | ---------- | -------------- |
| **3D primitives** | | |
| `cube()` | `Cube` | `size`, `center` |
| `sphere()` | `Sphere` | `r`, `d`, `$fn` |
| `cylinder()` | `Cylinder` | `h`, `r1`, `r2`, `$fn` |
| `polyhedron()` | `Polyhedron` | `points`, `faces`, `convexity` |
| **2D primitives** | | |
| `square()` | `Square` | `size`, `center` |
| `circle()` | `Circle` | `r`, `d`, `$fn` |
| `polygon()` | `Polygon` | `points`, `paths`, `convexity` |
| **CSG** | | |
| `union()` | `Union` | children |
| `difference()` | `Difference` | children |
| `intersection()` | `Intersection` | children |
| **Transforms** | | |
| `translate()` | `Translate` | `v` (vector) |
| `rotate()` | `Rotate` | `a` (angles), optional `v` |
| `scale()` | `Scale` | `v` (vector) |
| **2D → 3D** | | |
| `linear_extrude()` | `LinearExtrude` | `height`, `center`, `twist`, `scale`; one 2D child |
| `rotate_extrude()` | `RotateExtrude` | `angle`, `convexity`, `$fn`; one 2D child |
| **Text** | | |
| `text()` | `Text` | `text`, `size`, `font`, `halign`, `valign` |
| **Other** | | |
| `{ }` (group) | `Group` | children |
| inline code | `Raw` | `code` |
| `surface()` | `Surface` | `file`, `center`, `invert`, `convexity` |
| `import()` | `Import` | `file`, `convexity`, `layer` |

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
