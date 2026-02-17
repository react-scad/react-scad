import * as React from "react";
import type { PropsWithChildren } from "react";
import type { RawNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface RawProps extends PropsWithChildren {
	code: string;
}

export const Raw = (props: RawProps) => React.createElement(Primitive, { ...props, type: "raw" });
Raw.displayName = "Raw";

export function serialize(node: RawNode, indent: string, _ctx: SerializeContext): string {
	if (!node.code.trim()) return "";
	return node.code
		.split("\n")
		.map((line) => indent + line)
		.join("\n");
}
