# [react-scad](https://github.com/react-scad/react-scad) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/react-scad/react-scad/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@react-scad/core.svg?style=flat)](https://www.npmjs.com/package/@react-scad/core) [![Publish](https://github.com/react-scad/react-scad/actions/workflows/cicd.yml/badge.svg)](https://github.com/react-scad/react-scad/actions/workflows/cicd.yml) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/react-scad/react-scad#contributing)

Render JSX to **SCAD** models using the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler).

- Describe models as a tree of components instead of imperative SCAD; avoids nested modules and parameter threading.
- Same React/JSX mental model (components, props, composition), output is 3D.
- Writes plain `.scad` files for [OpenSCAD](https://openscad.org/) or any slicer.

---

## Preview

![Example](./assets/example.gif)

*Rocket example with animated translation.*

---

## Why react-scad?

SCAD is good for parametric 3D but scripts are imperative and nesting gets heavy; composing modules and passing parameters is tedious.

A lot of people already think in components and JSX from building UIs. **react-scad** aims to facilitate that same way of thinking for parametric 3D.

---

## Getting Started

### Prerequisites

- **Node.js** 18+

### Create a new project (recommended)

```bash
npx create-react-scad@latest my-project
cd my-project
npm start
```

That’s it — open the generated `model.scad` in [OpenSCAD](https://openscad.org/) or your slicer.

---

### Add to an existing project

#### Install

```bash
npm install react @react-scad/core
```

<details>
<summary>pnpm or yarn</summary>

```bash
pnpm add react @react-scad/core
# or
yarn add react @react-scad/core
```

</details>

#### Minimal example

Create a file `main.tsx` (or `main.jsx`):

```jsx
import React from "react";
import { createRoot, Cube, Sphere, Union } from "@react-scad/core";

// Output path: the .scad file that will be created
const root = createRoot("model.scad");

root.render(
  <Union>
    <Cube size={[10, 10, 10]} center />
    <Sphere r={6} />
  </Union>
);
```

#### Run and write the `.scad` file

```bash
npx tsx main.tsx
```

Watch mode (re-run on save):

```bash
npx tsx watch main.tsx
```

#### View the result

- Open the generated `.scad` file in [OpenSCAD](https://openscad.org/) to preview, export STL, or tweak.
- Or import the `.scad` (or an exported STL) into your slicer for 3D printing.

---

<details>
<summary>Advanced</summary>

### Custom Behavior

To write to a custom path or get the SCAD string in memory instead of using `createRoot(path)`, use `createContainer()`, `render()`, and `toScad()`:

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

Then run with `npx tsx main.tsx` or bundle with esbuild and run with Node.

### Interop with existing SCAD

You can reuse existing `.scad` libraries and snippets in two ways:

- **`Import`** — Emit OpenSCAD’s `import("path")` so the generated file pulls in another SCAD file (e.g. STL/DXF or a file that defines modules). Use this when the library is a separate file and you just need to reference it.

  ```jsx
  import { Import, Union } from "@react-scad/core";

  <Union>
    <Import file="lib/gears.scad" />
  </Union>
  ```

- **`Raw`** — Emit arbitrary SCAD code inline. Use this to paste a snippet, call a module from an imported library, or wrap a block of SCAD you don’t have a dedicated component for. Children are ignored; only the `code` prop is emitted (with indentation applied).

  ```jsx
  import { Raw, Union } from "@react-scad/core";

  // After Import "lib/gears.scad", call a module from it:
  <Raw code="gear(number_of_teeth=32, circular_pitch=200);" />

  // Or inject a small SCAD block:
  <Raw code={`include <BOSL2/std.scad>\nrounded_cube(20, 0.5);`} />
  ```

Typical pattern: **`Import`** the library file once (at top level or where needed), then use **`Raw`** to call its modules or paste any SCAD that fits your tree.

</details>

---

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

### Missing anything?

> If you need a SCAD primitive or feature that isn’t listed here, open an [issue](https://github.com/react-scad/react-scad/issues/new) or a PR.

---

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
   pnpm run sandbox:dev
   ```

4. **Format and lint** your code:
   ```bash
   pnpm run format
   pnpm run lint
   ```

5. **Open a PR** against `main` with a short description of the change. For bugs, reference the issue if one exists.

6. **Publishing** is done via GitHub Actions on push to `main`; no need to publish from a PR.

---

## Acknowledgements

- [React](https://react.dev/) and the [React reconciler](https://github.com/facebook/react/tree/main/packages/react-reconciler) for the rendering model that makes this approach possible.
- [OpenSCAD](https://openscad.org/) for the SCAD language and documentation.

---

## License

MIT
