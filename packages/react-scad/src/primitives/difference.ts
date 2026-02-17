import * as React from "react";
import type { PropsWithChildren } from "react";
import type { DifferenceNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface DifferenceProps extends PropsWithChildren {}

export const Difference = (props: DifferenceProps) =>
	React.createElement(Primitive, { ...props, type: "difference" });
Difference.displayName = "Difference";

export function serialize(node: DifferenceNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return inner ? `difference() {\n${inner}\n${indent}}` : "difference() {}";
}
