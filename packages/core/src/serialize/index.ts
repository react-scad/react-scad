import { serialize as serializeCircle } from "../primitives/circle.js";
import { serialize as serializeCube } from "../primitives/cube.js";
import { serialize as serializeCylinder } from "../primitives/cylinder.js";
import { serialize as serializeDifference } from "../primitives/difference.js";
import { serialize as serializeGroup } from "../primitives/group.js";
import { serialize as serializeImport } from "../primitives/import.js";
import { serialize as serializeIntersection } from "../primitives/intersection.js";
import { serialize as serializeLinearExtrude } from "../primitives/linear-extrude.js";
import { serialize as serializePolygon } from "../primitives/polygon.js";
import { serialize as serializePolyhedron } from "../primitives/polyhedron.js";
import { serialize as serializeRaw } from "../primitives/raw.js";
import { serialize as serializeRotate } from "../primitives/rotate.js";
import { serialize as serializeRotateExtrude } from "../primitives/rotate-extrude.js";
import { serialize as serializeScale } from "../primitives/scale.js";
import { serialize as serializeSphere } from "../primitives/sphere.js";
import { serialize as serializeSquare } from "../primitives/square.js";
import { serialize as serializeSurface } from "../primitives/surface.js";
import { serialize as serializeText } from "../primitives/text.js";
import { serialize as serializeTranslate } from "../primitives/translate.js";
import { serialize as serializeUnion } from "../primitives/union.js";
import type { ScadNode, SerializeContext } from "../types.js";

function serializeNode(node: ScadNode, indent: string, ctx: SerializeContext): string {
	switch (node.kind) {
		case "cube":
			return serializeCube(node, indent, ctx);
		case "sphere":
			return serializeSphere(node, indent, ctx);
		case "cylinder":
			return serializeCylinder(node, indent, ctx);
		case "polyhedron":
			return serializePolyhedron(node, indent, ctx);
		case "square":
			return serializeSquare(node, indent, ctx);
		case "circle":
			return serializeCircle(node, indent, ctx);
		case "polygon":
			return serializePolygon(node, indent, ctx);
		case "union":
			return serializeUnion(node, indent, ctx);
		case "difference":
			return serializeDifference(node, indent, ctx);
		case "intersection":
			return serializeIntersection(node, indent, ctx);
		case "translate":
			return serializeTranslate(node, indent, ctx);
		case "rotate":
			return serializeRotate(node, indent, ctx);
		case "scale":
			return serializeScale(node, indent, ctx);
		case "linear_extrude":
			return serializeLinearExtrude(node, indent, ctx);
		case "rotate_extrude":
			return serializeRotateExtrude(node, indent, ctx);
		case "text":
			return serializeText(node, indent, ctx);
		case "surface":
			return serializeSurface(node, indent, ctx);
		case "import":
			return serializeImport(node, indent, ctx);
		case "group":
			return serializeGroup(node, indent, ctx);
		case "raw":
			return serializeRaw(node, indent, ctx);
		case "unknown": {
			const nextIndent = `${indent}  `;
			const inner = node.children
				.map((c) => nextIndent + ctx.serializeNode(c, nextIndent))
				.join("\n");
			return inner
				? `// ${node.type}\n${indent}{\n${inner}\n${indent}}`
				: `// ${node.type} (no children)`;
		}
	}
}

const CREDIT = "// Generated using react-scad (https://github.com/react-scad/react-scad)";

export function toScad(container: { children: ScadNode[] }): string {
	const ctx: SerializeContext = {
		serializeNode: (n, i) => serializeNode(n, i, ctx),
	};
	const body = container.children.map((n) => serializeNode(n, "", ctx)).join("\n\n");
	return body ? `${CREDIT}\n\n${body}` : CREDIT;
}

export interface BuildTreeEntry {
	kind: string;
	size: number;
	children: BuildTreeEntry[];
}

function buildTreeEntry(node: ScadNode, ctx: SerializeContext): BuildTreeEntry {
	const size = ctx.serializeNode(node, "").length;
	const children = node.children.map((c) => buildTreeEntry(c, ctx));
	return { kind: node.kind, size, children };
}

export function getBuildTree(container: {
	children: ScadNode[];
}): { entries: BuildTreeEntry[]; totalBytes: number } {
	const ctx: SerializeContext = {
		serializeNode: (n, i) => serializeNode(n, i, ctx),
	};
	const entries = container.children.map((n) => buildTreeEntry(n, ctx));
	const totalBytes = entries.reduce((sum, e) => sum + e.size, 0);
	return { entries, totalBytes };
}
