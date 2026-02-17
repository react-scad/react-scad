import { serialize as serializeCube } from "../primitives/cube.js";
import { serialize as serializeCylinder } from "../primitives/cylinder.js";
import { serialize as serializeDifference } from "../primitives/difference.js";
import { serialize as serializeGroup } from "../primitives/group.js";
import { serialize as serializeIntersection } from "../primitives/intersection.js";
import { serialize as serializeRaw } from "../primitives/raw.js";
import { serialize as serializeRotate } from "../primitives/rotate.js";
import { serialize as serializeScale } from "../primitives/scale.js";
import { serialize as serializeSphere } from "../primitives/sphere.js";
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

const CREDIT = "// Generated using react-scad (https://github.com/leonmeka/react-scad)";

export function toScad(container: { children: ScadNode[] }): string {
	const ctx: SerializeContext = {
		serializeNode: (n, i) => serializeNode(n, i, ctx),
	};
	const body = container.children.map((n) => serializeNode(n, "", ctx)).join("\n\n");
	return body ? `${CREDIT}\n\n${body}` : CREDIT;
}
