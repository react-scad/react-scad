import type React from "react";
import ReactReconciler from "react-reconciler";
import type { ScadContainer } from "../types.js";
import * as HostConfig from "./index.js";

type ReconcilerInstance = {
	createContainer(container: ScadContainer, ...args: readonly unknown[]): unknown;
	updateContainer(
		element: React.ReactElement,
		root: unknown,
		container: ScadContainer | null,
		callback: (() => void) | null,
	): void;
};

const Reconciler = ReactReconciler(
	HostConfig as unknown as Parameters<typeof ReactReconciler>[0],
) as ReconcilerInstance;

const CONTAINER_ARGS = [0, null, false, null, "", () => {}, null] as const;

export function createFiberRoot(container: ScadContainer): unknown {
	return Reconciler.createContainer(container, ...CONTAINER_ARGS);
}

export function updateContainer(
	element: React.ReactElement,
	fiberRoot: unknown,
	container: ScadContainer | null,
	callback: (() => void) | null,
): void {
	Reconciler.updateContainer(element, fiberRoot, container, callback);
}
