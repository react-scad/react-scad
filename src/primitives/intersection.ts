import * as React from "react";
import type { PropsWithChildren } from "react";
import type { IntersectionNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface IntersectionProps extends PropsWithChildren {}

export const Intersection = (props: IntersectionProps) =>
	React.createElement(Primitive, { ...props, type: "intersection" });
Intersection.displayName = "Intersection";

export function serialize(node: IntersectionNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return inner ? `intersection() {\n${inner}\n${indent}}` : "intersection() {}";
}
