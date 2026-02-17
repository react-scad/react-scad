import * as React from "react";
import type { PropsWithChildren } from "react";
import type { ImportNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface ImportProps extends PropsWithChildren {
	file: string;
	convexity?: number;
	layer?: string;
}

export const Import = (props: ImportProps) =>
	React.createElement(Primitive, { ...props, type: "import" });
Import.displayName = "Import";

function escapePath(s: string): string {
	return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function serialize(node: ImportNode, _indent: string, _ctx: SerializeContext): string {
	const parts: string[] = [`"${escapePath(node.file)}"`];
	if (node.convexity != null) parts.push(`convexity = ${node.convexity}`);
	if (node.layer != null) parts.push(`layer = "${escapePath(node.layer)}"`);
	return `import(${parts.join(", ")});`;
}
