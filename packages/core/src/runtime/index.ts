import type { ScadContainer, ScadNode } from "../types.js";
import { cloneScadNode, createScadNode, updateScadNode } from "./node-ops.js";

export type { ScadContainer, ScadNode };

const NO_CONTEXT = null;

export const rendererVersion = "0.1.0";
export const rendererPackageName = "react-scad";
export const extraDevToolsConfig = null;

export function getRootHostContext(): null {
	return NO_CONTEXT;
}

export function getChildHostContext(
	_parentHostContext: null,
	_type: string,
	_rootContainer: ScadContainer,
): null {
	return NO_CONTEXT;
}

export function prepareForCommit(_containerInfo: ScadContainer): null {
	return null;
}

export function resetAfterCommit(_containerInfo: ScadContainer): void {}

export function createInstance(
	type: string,
	props: Record<string, unknown>,
	_rootContainer: ScadContainer,
	_hostContext: null,
	_internalHandle: unknown,
): ScadNode {
	const node = createScadNode(type, { ...props });
	return node;
}

export function cloneMutableInstance(instance: ScadNode, keepChildren: boolean): ScadNode {
	return cloneScadNode(instance, keepChildren);
}

export function appendInitialChild(parentInstance: ScadNode, child: ScadNode): void {
	parentInstance.children.push(child);
}

export function finalizeInitialChildren(
	_instance: ScadNode,
	_type: string,
	_props: Record<string, unknown>,
	_rootContainer: ScadContainer,
	_hostContext: null,
): boolean {
	return false;
}

export function prepareUpdate(
	_instance: ScadNode,
	_type: string,
	oldProps: Record<string, unknown>,
	newProps: Record<string, unknown>,
	_rootContainer: ScadContainer,
	_hostContext: null,
): Record<string, unknown> | null {
	return newProps;
}

export function shouldSetTextContent(_type: string, _props: Record<string, unknown>): boolean {
	return false;
}

export function createTextInstance(
	_text: string,
	_rootContainer: ScadContainer,
	_hostContext: null,
	_internalHandle: unknown,
): never {
	throw new Error("react-scad: Text nodes are not supported. Use only SCAD primitives.");
}

export function cloneMutableTextInstance(_textInstance: string): string {
	throw new Error("react-scad: Text nodes are not supported.");
}

export const scheduleTimeout = globalThis.setTimeout;
export const cancelTimeout = globalThis.clearTimeout;
export const noTimeout = -1;

export function getPublicInstance(instance: ScadNode): ScadNode {
	return instance;
}

export const isPrimaryRenderer = false;
export const warnsIfNotActing = false;
export const supportsMutation = true;

export function appendChild(parentInstance: ScadNode, child: ScadNode): void {
	parentInstance.children.push(child);
}

export function appendChildToContainer(container: ScadContainer, child: ScadNode): void {
	container.children.push(child);
}

export function insertBefore(
	parentInstance: ScadNode,
	child: ScadNode,
	beforeChild: ScadNode,
): void {
	const i = parentInstance.children.indexOf(beforeChild);
	if (i === -1) parentInstance.children.push(child);
	else parentInstance.children.splice(i, 0, child);
}

export function insertInContainerBefore(
	container: ScadContainer,
	child: ScadNode,
	beforeChild: ScadNode,
): void {
	const i = container.children.indexOf(beforeChild);
	if (i === -1) container.children.push(child);
	else container.children.splice(i, 0, child);
}

export function removeChild(parentInstance: ScadNode, child: ScadNode): void {
	const i = parentInstance.children.indexOf(child);
	if (i !== -1) parentInstance.children.splice(i, 1);
}

export function removeChildFromContainer(container: ScadContainer, child: ScadNode): void {
	const i = container.children.indexOf(child);
	if (i !== -1) container.children.splice(i, 1);
}

export function resetTextContent(_instance: ScadNode): void {}

export function commitTextUpdate(
	_textInstance: unknown,
	_oldText: string,
	_newText: string,
): void {}

export function commitMount(
	_instance: ScadNode,
	_type: string,
	_props: Record<string, unknown>,
	_internalHandle: unknown,
): void {}

export function commitUpdate(
	instance: ScadNode,
	updatePayload: Record<string, unknown> | null,
	_type: string,
	_prevProps: Record<string, unknown>,
	_nextProps: Record<string, unknown>,
	_internalHandle: unknown,
): void {
	if (updatePayload) updateScadNode(instance, updatePayload);
}

export function hideInstance(_instance: ScadNode): void {}

export function hideTextInstance(_textInstance: unknown): void {}

export function unhideInstance(_instance: ScadNode, _props: Record<string, unknown>): void {}

export function unhideTextInstance(_textInstance: unknown, _text: string): void {}

export function clearContainer(container: ScadContainer): void {
	container.children.length = 0;
}

export function preparePortalMount(_containerInfo: ScadContainer): void {}
export function getInstanceFromNode(_node: unknown): null {
	return null;
}
export function beforeActiveInstanceBlur(_instance: unknown): void {}
export function afterActiveInstanceBlur(): void {}
export function detachDeletedInstance(_node: ScadNode): void {}
export function requestPostPaintCallback(_callback: (time: number) => void): void {}
export function maySuspendCommit(_type: string, _props: unknown): false {
	return false;
}
export function maySuspendCommitOnUpdate(
	_type: string,
	_oldProps: unknown,
	_newProps: unknown,
): false {
	return false;
}
export function maySuspendCommitInSyncRender(_type: string, _props: unknown): false {
	return false;
}
export function preloadInstance(_type: string, _props: unknown): boolean {
	return true;
}
export function startSuspendingCommit(): null {
	return null;
}
export function suspendInstance(
	_state: unknown,
	_instance: unknown,
	_type: string,
	_props: unknown,
): void {}
export function waitForCommitToBeReady(): null {
	return null;
}
export function getSuspendedCommitReason(_state: unknown, _root: ScadContainer): null {
	return null;
}

const DefaultEventPriority = 0;
let currentUpdatePriority = DefaultEventPriority;

export function setCurrentUpdatePriority(newPriority: number): void {
	currentUpdatePriority = newPriority;
}

export function getCurrentUpdatePriority(): number {
	return currentUpdatePriority;
}

export function getCurrentEventPriority(): number {
	return DefaultEventPriority;
}

export function resolveUpdatePriority(): number {
	return currentUpdatePriority;
}

export function trackSchedulerEvent(): void {}
export function resolveEventType(): null {
	return null;
}
export function resolveEventTimeStamp(): number {
	return -1;
}
export function shouldAttemptEagerTransition(): false {
	return false;
}
