import * as React from "react";
import type { PropsWithChildren } from "react";
import type { SerializeContext, TranslateNode, Vec3 } from "../types.js";
import { formatVec3 } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface TranslateProps extends PropsWithChildren {
	v: Vec3;
}

export const Translate = (props: TranslateProps) =>
	React.createElement(Primitive, { ...props, type: "translate" });
Translate.displayName = "Translate";

export function serialize(node: TranslateNode, indent: string, ctx: SerializeContext): string {
	const nextIndent = `${indent}  `;
	const inner = node.children.map((c) => nextIndent + ctx.serializeNode(c, nextIndent)).join("\n");
	return `translate(${formatVec3(node.v)}) {\n${inner}\n${indent}}`;
}
