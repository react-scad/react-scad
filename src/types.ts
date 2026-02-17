export type ScadExpr = number | string;
export type Vec3 = [ScadExpr, ScadExpr, ScadExpr] | ScadExpr;
export type Fn = number | undefined;

export interface CubeNode {
	kind: "cube";
	size: Vec3;
	center: boolean;
	children: ScadNode[];
}

export interface SphereNode {
	kind: "sphere";
	r?: ScadExpr;
	d?: ScadExpr;
	$fn?: Fn;
	children: ScadNode[];
}

export interface CylinderNode {
	kind: "cylinder";
	h: ScadExpr;
	r1: ScadExpr;
	r2: ScadExpr;
	$fn?: Fn;
	children: ScadNode[];
}

export interface UnionNode {
	kind: "union";
	children: ScadNode[];
}

export interface DifferenceNode {
	kind: "difference";
	children: ScadNode[];
}

export interface IntersectionNode {
	kind: "intersection";
	children: ScadNode[];
}

export interface TranslateNode {
	kind: "translate";
	v: Vec3;
	children: ScadNode[];
}

export interface RotateNode {
	kind: "rotate";
	a: Vec3;
	v?: Vec3;
	children: ScadNode[];
}

export interface ScaleNode {
	kind: "scale";
	v: Vec3;
	children: ScadNode[];
}

export interface GroupNode {
	kind: "group";
	children: ScadNode[];
}

export interface RawNode {
	kind: "raw";
	code: string;
	children: ScadNode[];
}

export interface UnknownNode {
	kind: "unknown";
	type: string;
	props: Record<string, unknown>;
	children: ScadNode[];
}

export type ScadNode =
	| CubeNode
	| SphereNode
	| CylinderNode
	| UnionNode
	| DifferenceNode
	| IntersectionNode
	| TranslateNode
	| RotateNode
	| ScaleNode
	| GroupNode
	| RawNode
	| UnknownNode;

export interface ScadContainer {
	children: ScadNode[];
}

export interface SerializeContext {
	serializeNode: (node: ScadNode, indent: string) => string;
}
