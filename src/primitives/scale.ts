import * as React from "react";
import type { PropsWithChildren } from "react";
import type { ScaleNode, SerializeContext, Vec3 } from "../types.js";
import { formatVec3 } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface ScaleProps extends PropsWithChildren {
	v: Vec3;
}

export const Scale = (props: ScaleProps) =>
	React.createElement(Primitive, { ...props, type: "scale" });
Scale.displayName = "Scale";

export function serialize(node: ScaleNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return `scale(${formatVec3(node.v)}) {\n${inner}\n${indent}}`;
}
