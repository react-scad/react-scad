import * as React from "react";
import type { PropsWithChildren } from "react";
import type { RotateExtrudeNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface RotateExtrudeProps extends PropsWithChildren {
	angle?: number;
	convexity?: number;
	$fn?: number;
}

export const RotateExtrude = (props: RotateExtrudeProps) =>
	React.createElement(Primitive, { ...props, type: "rotate_extrude" });
RotateExtrude.displayName = "RotateExtrude";

export function serialize(node: RotateExtrudeNode, indent: string, ctx: SerializeContext): string {
	const parts: string[] = [];
	if (node.angle != null) parts.push(`angle = ${String(node.angle)}`);
	if (node.convexity != null) parts.push(`convexity = ${node.convexity}`);
	if (node.$fn != null) parts.push(`$fn = ${node.$fn}`);

	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	const args = parts.length > 0 ? parts.join(", ") : "";
	return args
		? `rotate_extrude(${args}) {\n${inner}\n${indent}}`
		: `rotate_extrude() {\n${inner}\n${indent}}`;
}
