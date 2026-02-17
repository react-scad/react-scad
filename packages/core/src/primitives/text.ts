import * as React from "react";
import type { PropsWithChildren } from "react";
import type { SerializeContext, TextNode } from "../types.js";
import { Primitive } from "./primitive.js";

export interface TextProps extends PropsWithChildren {
	text: string;
	size?: number;
	font?: string;
	halign?: "left" | "center" | "right";
	valign?: "top" | "center" | "baseline" | "bottom";
	direction?: "ltr" | "rtl" | "ttb" | "btt";
	language?: string;
	script?: string;
	spacing?: number;
}

export const Text = (props: TextProps) =>
	React.createElement(Primitive, { ...props, type: "text" });
Text.displayName = "Text";

function escapeString(s: string): string {
	return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n");
}

export function serialize(node: TextNode, _indent: string, _ctx: SerializeContext): string {
	const parts: string[] = [`text = "${escapeString(node.text)}"`];
	if (node.size != null) parts.push(`size = ${node.size}`);
	if (node.font != null) parts.push(`font = "${escapeString(node.font)}"`);
	if (node.halign != null) parts.push(`halign = "${node.halign}"`);
	if (node.valign != null) parts.push(`valign = "${node.valign}"`);
	if (node.direction != null) parts.push(`direction = "${node.direction}"`);
	if (node.language != null) parts.push(`language = "${escapeString(node.language)}"`);
	if (node.script != null) parts.push(`script = "${escapeString(node.script)}"`);
	if (node.spacing != null) parts.push(`spacing = ${node.spacing}`);
	return `text(${parts.join(", ")});`;
}
