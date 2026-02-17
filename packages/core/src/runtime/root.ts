import { writeFileSync } from "node:fs";
import type React from "react";
import { toScad } from "../serialize/index.js";
import type { ScadContainer } from "../types.js";
import { createScadContainer } from "./node-ops.js";
import { createFiberRoot, updateContainer } from "./reconciler.js";

export type { ScadContainer };

export interface ScadRoot {
	render(element: React.ReactElement): void;
	toScad(): string;
}

export type Path = string;

export function createRoot(path?: Path): ScadRoot {
	const container = createScadContainer();
	const fiberRoot = createFiberRoot(container);

	return {
		render(element: React.ReactElement) {
			updateContainer(element, fiberRoot, null, null);
			if (path) writeFileSync(path, toScad(container), "utf8");
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
