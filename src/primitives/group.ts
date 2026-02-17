import * as React from "react";
import type { PropsWithChildren } from "react";
import type { GroupNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface GroupProps extends PropsWithChildren {}

export const Group = (props: GroupProps) =>
	React.createElement(Primitive, { ...props, type: "group" });
Group.displayName = "Group";

export function serialize(node: GroupNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return inner ? `{\n${inner}\n${indent}}` : "{}";
}
