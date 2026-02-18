# create-react-scad

Scaffold a new [react-scad](https://github.com/react-scad/react-scad) project. Built with [Brocli](https://github.com/drizzle-team/brocli) and TypeScript.

## Usage

```bash
npx create-react-scad my-model
```

Or explicitly:

```bash
npx create-react-scad new my-model
```

Clones [react-scad/example](https://github.com/react-scad/example) into `my-model/`, removes the original `.git` history, and sets the package name to your project name. You get the same layout as the example repo (e.g. `package.json`, entry file, README).

By default, `npm install` is run in the new project. Use `--no-install` to skip:

```bash
npx create-react-scad my-model --no-install
```

Help and version:

```bash
npx create-react-scad --help
npx create-react-scad new --help
npx create-react-scad --version
```

## From the monorepo

From the react-scad repo root (build first: `pnpm run build` in `packages/create-react-scad` or from root `pnpm -C packages/create-react-scad run build`):

```bash
pnpm create my-model
```

## License

MIT
