import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { log } from "../log.js";
import { toScad } from "../serialize/index.js";
import type { ScadContainer } from "../types.js";

const writeOnCommitPaths = new WeakMap<ScadContainer, string>();

export function registerWriteOnCommit(container: ScadContainer, path: string): void {
	writeOnCommitPaths.set(container, path);
}

export function writeAfterCommit(container: ScadContainer): void {
	const path = writeOnCommitPaths.get(container);
	if (path) {
		const start = Date.now();
		const dir = dirname(path);
		if (dir !== ".") mkdirSync(dir, { recursive: true });
		writeFileSync(path, toScad(container), "utf8");
		const ms = Date.now() - start;
		log.wrote(path, ms);
	}
}
