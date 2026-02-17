# react-scad

Render JSX to **OpenSCAD** models using the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler).

- Write declarative 3D with React components; no imperative OpenSCAD scripting
- Compose shapes with familiar JSX; get `.scad` source for OpenSCAD or 3D printing
- Use [@react-scad/cli](../cli) via npx to build and run (no need to install the CLI)

Install the library and React:

```bash
npm install react @react-scad/react-scad
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

Save as `main.tsx`, then run it (CLI via npx—no need to install it):

```bash
npx @react-scad/cli run main.tsx
npx @react-scad/cli run main.tsx --watch
```

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
