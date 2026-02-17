import * as React from "react";
import type { PropsWithChildren } from "react";
import type { LinearExtrudeNode, SerializeContext, Vec2 } from "../types.js";
import { formatVec2 } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface LinearExtrudeProps extends PropsWithChildren {
	height: number;
	center?: boolean;
	twist?: number;
	scale?: Vec2 | number;
	convexity?: number;
	slices?: number;
	$fn?: number;
}

export const LinearExtrude = (props: LinearExtrudeProps) =>
	React.createElement(Primitive, { ...props, type: "linear_extrude" });
LinearExtrude.displayName = "LinearExtrude";

function formatScale(scale: LinearExtrudeNode["scale"]): string | undefined {
	if (scale == null) return undefined;
	if (typeof scale === "number" || typeof scale === "string") return String(scale);
	return formatVec2(scale);
}

export function serialize(node: LinearExtrudeNode, indent: string, ctx: SerializeContext): string {
	const parts: string[] = [`height = ${String(node.height)}`];
	if (node.center === true) parts.push("center = true");
	if (node.twist != null) parts.push(`twist = ${String(node.twist)}`);
	const scaleStr = formatScale(node.scale);
	if (scaleStr != null) parts.push(`scale = ${scaleStr}`);
	if (node.convexity != null) parts.push(`convexity = ${node.convexity}`);
	if (node.slices != null) parts.push(`slices = ${node.slices}`);
	if (node.$fn != null) parts.push(`$fn = ${node.$fn}`);

	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return `linear_extrude(${parts.join(", ")}) {\n${inner}\n${indent}}`;
}
