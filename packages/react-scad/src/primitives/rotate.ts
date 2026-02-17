import * as React from "react";
import type { PropsWithChildren } from "react";
import type { RotateNode, SerializeContext, Vec3 } from "../types.js";
import { formatVec3 } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface RotateProps extends PropsWithChildren {
	a: Vec3;
	v?: Vec3;
}

export const Rotate = (props: RotateProps) =>
	React.createElement(Primitive, { ...props, type: "rotate" });
Rotate.displayName = "Rotate";

export function serialize(node: RotateNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	const args = node.v != null ? `${formatVec3(node.a)}, ${formatVec3(node.v)}` : formatVec3(node.a);
	return `rotate(${args}) {\n${inner}\n${indent}}`;
}
