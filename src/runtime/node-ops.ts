import type { ScadContainer, ScadNode, Vec3 } from "../types.js";

const DEFAULT_VEC3: Vec3 = [0, 0, 0];
const DEFAULT_SCALE: Vec3 = [1, 1, 1];

function toScadExpr(x: unknown): number | string {
	if (typeof x === "string") return x;
	const n = Number(x);
	return Number.isFinite(n) ? n : 0;
}

function toVec3(v: unknown): Vec3 {
	if (typeof v === "number") return v;
	if (typeof v === "string") return v;
	if (Array.isArray(v) && v.length >= 3)
		return [toScadExpr(v[0]), toScadExpr(v[1]), toScadExpr(v[2])];
	return DEFAULT_VEC3;
}

function num(x: unknown, fallback: number): number {
	if (typeof x === "string") return fallback;
	const n = Number(x);
	return Number.isFinite(n) ? n : fallback;
}

function numOrExpr(x: unknown, fallback: number): number | string {
	if (typeof x === "string") return x;
	const n = Number(x);
	return Number.isFinite(n) ? n : fallback;
}

function bool(x: unknown, fallback: boolean): boolean {
	if (typeof x === "boolean") return x;
	return fallback;
}

export function createScadNode(type: string, props: Record<string, unknown>): ScadNode {
	const children: ScadNode[] = [];
	switch (type) {
		case "cube": {
			const size = props.size ?? 1;
			return {
				kind: "cube",
				size: typeof size === "number" ? size : toVec3(size),
				center: bool(props.center, false),
				children,
			};
		}
		case "sphere":
			return {
				kind: "sphere",
				r:
					props.r != null
						? numOrExpr(props.r, 1)
						: props.radius != null
							? numOrExpr(props.radius, 1)
							: undefined,
				d:
					props.d != null
						? numOrExpr(props.d, 2)
						: props.diameter != null
							? numOrExpr(props.diameter, 2)
							: undefined,
				$fn:
					props.$fn != null ? num(props.$fn, 0) : props.fn != null ? num(props.fn, 0) : undefined,
				children,
			};
		case "cylinder": {
			const r1 = props.r1 ?? props.r ?? props.radius ?? 1;
			const r2 = props.r2 ?? r1;
			return {
				kind: "cylinder",
				h: numOrExpr(props.h ?? props.height, 1),
				r1: numOrExpr(r1, 1),
				r2: numOrExpr(r2, 1),
				$fn:
					props.$fn != null ? num(props.$fn, 0) : props.fn != null ? num(props.fn, 0) : undefined,
				children,
			};
		}
		case "union":
			return { kind: "union", children };
		case "difference":
			return { kind: "difference", children };
		case "intersection":
			return { kind: "intersection", children };
		case "translate":
			return {
				kind: "translate",
				v: toVec3(props.v ?? props.vector ?? DEFAULT_VEC3),
				children,
			};
		case "rotate":
			return {
				kind: "rotate",
				a: toVec3(props.a ?? props.angle ?? props.angles ?? DEFAULT_VEC3),
				v: props.v != null || props.vector != null ? toVec3(props.v ?? props.vector) : undefined,
				children,
			};
		case "scale":
			return {
				kind: "scale",
				v: toVec3(props.v ?? props.vector ?? DEFAULT_SCALE),
				children,
			};
		case "group":
			return { kind: "group", children };
		case "raw":
			return {
				kind: "raw",
				code: props.code != null ? String(props.code) : "",
				children,
			};
		default:
			return { kind: "unknown", type, props: { ...props }, children };
	}
}

export function updateScadNode(node: ScadNode, nextProps: Record<string, unknown>): void {
	switch (node.kind) {
		case "cube": {
			const size = nextProps.size ?? node.size;
			node.size = typeof size === "number" ? size : toVec3(size);
			node.center = bool(nextProps.center, node.center);
			break;
		}
		case "sphere":
			if (nextProps.r != null) node.r = numOrExpr(nextProps.r, 1);
			if (nextProps.radius != null) node.r = numOrExpr(nextProps.radius, 1);
			if (nextProps.d != null) node.d = numOrExpr(nextProps.d, 2);
			if (nextProps.diameter != null) node.d = numOrExpr(nextProps.diameter, 2);
			if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
			if (nextProps.fn != null) node.$fn = num(nextProps.fn, 0);
			break;
		case "cylinder":
			node.h = numOrExpr(nextProps.h ?? nextProps.height ?? node.h, 1);
			if (nextProps.r1 != null) node.r1 = numOrExpr(nextProps.r1, 1);
			if (nextProps.r != null) node.r1 = numOrExpr(nextProps.r, 1);
			if (nextProps.radius != null) node.r1 = numOrExpr(nextProps.radius, 1);
			if (nextProps.r2 != null)
				node.r2 = numOrExpr(nextProps.r2, typeof node.r1 === "number" ? node.r1 : 1);
			if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
			if (nextProps.fn != null) node.$fn = num(nextProps.fn, 0);
			break;
		case "translate":
			node.v = toVec3(nextProps.v ?? nextProps.vector ?? node.v);
			break;
		case "rotate":
			node.a = toVec3(nextProps.a ?? nextProps.angle ?? nextProps.angles ?? node.a);
			if (nextProps.v != null || nextProps.vector != null)
				node.v = toVec3(nextProps.v ?? nextProps.vector);
			break;
		case "scale":
			node.v = toVec3(nextProps.v ?? nextProps.vector ?? node.v);
			break;
		case "raw":
			if (nextProps.code != null) node.code = String(nextProps.code);
			break;
		case "unknown":
			node.props = { ...nextProps };
			break;
		default:
			break;
	}
}

export function cloneScadNode(node: ScadNode, keepChildren: boolean): ScadNode {
	const children = keepChildren ? node.children.map((c) => cloneScadNode(c, true)) : [];
	switch (node.kind) {
		case "cube":
			return { kind: "cube", size: node.size, center: node.center, children };
		case "sphere":
			return { kind: "sphere", r: node.r, d: node.d, $fn: node.$fn, children };
		case "cylinder":
			return {
				kind: "cylinder",
				h: node.h,
				r1: node.r1,
				r2: node.r2,
				$fn: node.$fn,
				children,
			};
		case "union":
			return { kind: "union", children };
		case "difference":
			return { kind: "difference", children };
		case "intersection":
			return { kind: "intersection", children };
		case "translate":
			return { kind: "translate", v: node.v, children };
		case "rotate":
			return { kind: "rotate", a: node.a, v: node.v, children };
		case "scale":
			return { kind: "scale", v: node.v, children };
		case "group":
			return { kind: "group", children };
		case "raw":
			return { kind: "raw", code: node.code, children };
		case "unknown":
			return {
				kind: "unknown",
				type: node.type,
				props: { ...node.props },
				children,
			};
	}
}

export function createScadContainer(): ScadContainer {
	return { children: [] };
}
