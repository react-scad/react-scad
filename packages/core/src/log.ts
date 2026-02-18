import { createRequire } from "node:module";
import type { BuildTreeEntry } from "./serialize/index.js";

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

const PRIMITIVES = new Set([
  "cube",
  "sphere",
  "cylinder",
  "circle",
  "square",
  "polygon",
  "polyhedron",
  "text",
]);
const CSG = new Set(["union", "difference", "intersection"]);
const TRANSFORMS = new Set([
  "translate",
  "rotate",
  "scale",
  "linear_extrude",
  "rotate_extrude",
]);

function symbolForKind(kind: string): string {
  if (PRIMITIVES.has(kind)) return "●";
  if (CSG.has(kind)) return "○";
  if (TRANSFORMS.has(kind)) return "▸";
  return "◇";
}

function formatSize(bytes: number): string {
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} kB`;
  return `${bytes} B`;
}

const MAX_LINE_WIDTH = 100;
// Strip ANSI color codes (ESC [...m). ESC is \x1b, required for ANSI.
// biome-ignore lint/suspicious/noControlCharactersInRegex: required to strip ANSI codes
const ANSI_RE = /\x1b\[[0-9;]*m/g;

function stripAnsi(s: string): string {
  return s.replace(ANSI_RE, "");
}

function entryToInline(entry: BuildTreeEntry): string {
  const sym = symbolForKind(entry.kind);
  const head = `${sym} ${c.cyan(entry.kind)}`;
  if (entry.children.length === 0) return head;
  const inner = entry.children.map((ch) => entryToInline(ch)).join(", ");
  return `${head}(${inner})`;
}

/** Break at ", " or "), " so we don't split mid-token; measure length without ANSI. */
function wrapAtCommas(
  text: string,
  firstIndent: string,
  nextIndent: string,
): string[] {
  const firstLen = stripAnsi(firstIndent).length;
  const maxLen = MAX_LINE_WIDTH - firstLen;
  const plain = stripAnsi(text);
  if (plain.length <= maxLen) return [firstIndent + text];

  const breaks: number[] = [0];
  for (let i = 0; i < text.length; i++) {
    if (text.slice(i, i + 2) === ", ") breaks.push(i + 2);
    else if (text.slice(i, i + 3) === "), ") breaks.push(i + 3);
  }
  breaks.push(text.length);

  const lines: string[] = [];
  let lineStartIdx = 0;
  let endIdx = 1;
  while (endIdx < breaks.length) {
    const chunk = text.slice(breaks[lineStartIdx], breaks[endIdx]);
    if (stripAnsi(chunk).length > maxLen && endIdx > lineStartIdx + 1) {
      const indent = lines.length === 0 ? firstIndent : nextIndent;
      lines.push(indent + text.slice(breaks[lineStartIdx], breaks[endIdx - 1]));
      lineStartIdx = endIdx - 1;
    }
    endIdx++;
  }
  const lastIndent = lines.length === 0 ? firstIndent : nextIndent;
  lines.push(lastIndent + text.slice(breaks[lineStartIdx], text.length));
  return lines;
}

function formatTreeHorizontal(entries: BuildTreeEntry[]): void {
  const inline = entries.map((e) => entryToInline(e)).join(", ");
  const baseIndent = `${PAD}  `;
  const continueIndent = `${PAD}    `;
  const maxLen = MAX_LINE_WIDTH - stripAnsi(baseIndent).length;
  if (stripAnsi(inline).length <= maxLen) {
    line(baseIndent + inline);
    return;
  }
  const wrapped = wrapAtCommas(inline, baseIndent, continueIndent);
  for (const l of wrapped) line(l);
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
  stop(): void {
    line(`${PAD}${c.dim("Stopped.")}`);
  },
  buildTree(entries: BuildTreeEntry[], totalBytes: number): void {
    line("");
    line(`${PAD}${c.green("Compiled successfully.")}`);
    line("");
    line(`${PAD}${c.bold("Model")}`);
    if (entries.length === 0) {
      line(`${PAD}  ${c.dim("(empty)")}`);
    } else {
      formatTreeHorizontal(entries);
      line("");
      line(`${PAD}${c.dim("+ total output")} ${c.dim(formatSize(totalBytes))}`);
    }
    line("");
  },
};
