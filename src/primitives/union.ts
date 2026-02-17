import * as React from "react";
import type { PropsWithChildren } from "react";
import type { SerializeContext, UnionNode } from "../types.js";
import { Primitive } from "./primitive.js";

export interface UnionProps extends PropsWithChildren {}

export const Union = (props: UnionProps) =>
	React.createElement(Primitive, { ...props, type: "union" });
Union.displayName = "Union";

export function serialize(node: UnionNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return inner ? `union() {\n${inner}\n${indent}}` : "union() {}";
}
