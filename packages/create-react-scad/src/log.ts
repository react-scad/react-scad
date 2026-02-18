import { createRequire } from "node:module";

const noColor = process.env.NO_COLOR != null || !process.stdout.isTTY;
export const c = {
  dim: (s: string) => (noColor ? s : `\x1b[2m${s}\x1b[0m`),
  cyan: (s: string) => (noColor ? s : `\x1b[36m${s}\x1b[0m`),
  green: (s: string) => (noColor ? s : `\x1b[32m${s}\x1b[0m`),
  bold: (s: string) => (noColor ? s : `\x1b[1m${s}\x1b[0m`),
};

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };
const VERSION = pkg.version;

const TOOL_NAME = "create-react-scad";
const PAD = "  ";

function line(msg: string): void {
  console.log(msg);
}

export const log = {
  banner(): void {
    line(
      `${PAD}${c.cyan("◆")} ${c.bold(TOOL_NAME)} ${c.dim(VERSION)}  ${c.dim("-")} ${c.dim("Scaffold a new react-scad project")}`,
    );
  },
  created(projectName: string): void {
    line(
      `${PAD}${c.cyan("◆")} ${c.bold("Created")} react-scad project in ${c.cyan(`./${projectName}/`)}`,
    );
  },
  nextSteps(projectName: string, withInstall: boolean): void {
    if (withInstall) {
      line(`${PAD}${c.dim("○")} ${c.dim("Installing dependencies...")}`);
    } else {
      line(`${PAD}${c.dim("Next steps:")}`);
      line(`${PAD}${PAD}${c.dim("cd")} ${c.cyan(projectName)}`);
      line(`${PAD}${PAD}${c.dim("npm install")}`);
      line(`${PAD}${PAD}${c.dim("npm run dev")}`);
    }
  },
  done(projectName: string): void {
    line(`${PAD}${c.green("✓")} ${c.green("Done!")} ${c.dim("Next steps:")}`);
    line(`${PAD}${PAD}${c.dim("cd")} ${c.cyan(projectName)}`);
    line(`${PAD}${PAD}${c.dim("npm run dev")}`);
  },
  openScadHint(): void {
    line(
      `${PAD}${c.dim("→")} ${c.dim("Then open model.scad in OpenSCAD to view your model.")}`,
    );
  },
  blank(): void {
    line("");
  },
};
