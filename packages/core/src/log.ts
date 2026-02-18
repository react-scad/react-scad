import { createRequire } from "node:module";

const noColor = process.env.NO_COLOR != null || !process.stdout.isTTY;
export const c = {
  dim: (s: string) => (noColor ? s : `\x1b[2m${s}\x1b[0m`),
  cyan: (s: string) => (noColor ? s : `\x1b[36m${s}\x1b[0m`),
  green: (s: string) => (noColor ? s : `\x1b[32m${s}\x1b[0m`),
  red: (s: string) => (noColor ? s : `\x1b[31m${s}\x1b[0m`),
  yellow: (s: string) => (noColor ? s : `\x1b[33m${s}\x1b[0m`),
  bold: (s: string) => (noColor ? s : `\x1b[1m${s}\x1b[0m`),
};

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { version: string };
const VERSION = pkg.version;

const TOOL_NAME = "react-scad";
const PAD = "  ";

function line(msg: string): void {
  console.log(msg);
}

export const log = {
  banner(): void {
    line(
      `${PAD}${c.cyan("◆")} ${c.bold(TOOL_NAME)} ${c.dim(VERSION)}  ${c.dim("-")} ${c.dim("Ctrl+C to exit")}`,
    );
  },
  progress(msg: string): void {
    line(`${PAD}${c.dim("○")} ${c.dim(msg)}`);
  },
  complete(ms: number): void {
    line(`${PAD}${c.green("✓")} ${c.dim("Built")} ${c.dim(`in ${ms}ms`)}`);
  },
  outputPath(path: string): void {
    line(`${PAD}${c.dim("→")} ${c.cyan(path)}`);
  },
  stop(): void {
    line(`${PAD}${c.dim("Stopped.")}`);
  },
};
