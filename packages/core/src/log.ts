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

function formatSize(bytes: number): string {
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} kB`;
  return `${bytes} B`;
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
    const sec = (ms / 1000).toFixed(2);
    line(`${PAD}${c.green("✓")} ${c.green("Done")} ${c.dim(`in ${sec}s`)}`);
  },
  outputPath(path: string): void {
    line(`${PAD}${c.dim("→")} ${c.cyan(path)}`);
  },
  fileSize(bytes: number): void {
    line(`${PAD}${c.dim("+")} ${c.dim(formatSize(bytes))}`);
  },
  stop(): void {
    line(`${PAD}${c.dim("Stopped.")}`);
  },
};
