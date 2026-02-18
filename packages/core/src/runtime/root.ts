import { resolve } from "node:path";
import type React from "react";
import { log } from "../log.js";
import { toScad } from "../serialize/index.js";
import type { ScadContainer } from "../types.js";
import { createScadContainer } from "./node-ops.js";
import { createFiberRoot, updateContainer } from "./reconciler.js";
import { registerWriteOnCommit } from "./write-on-commit.js";

export type { ScadContainer };

export interface ScadRoot {
	render(element: React.ReactElement): void;
	toScad(): string;
}

export type Path = string;

export function createRoot(path?: Path): ScadRoot {
	const container = createScadContainer();
	const fiberRoot = createFiberRoot(container);
	if (path) {
		log.banner();
		registerWriteOnCommit(container, path);
	}

	return {
		render(element: React.ReactElement) {
			if (path) {
				log.progress("Building...");
			}
			const start = Date.now();
			updateContainer(element, fiberRoot, null, null);
			log.complete(Date.now() - start);
			if (path) {
				log.outputPath(resolve(path));
			}
		},
		toScad() {
			return toScad(container);
		},
	};
}

export function createContainer(): ScadContainer {
	return createScadContainer();
}

export function render(
	element: React.ReactElement,
	container: ScadContainer,
	callback?: () => void,
): void {
	const fiberRoot = createFiberRoot(container);
	updateContainer(element, fiberRoot, null, callback ?? null);
}

export { toScad } from "../serialize/index.js";
