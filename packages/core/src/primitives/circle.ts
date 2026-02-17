import * as React from "react";
import type { PropsWithChildren } from "react";
import type { CircleNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface CircleProps extends PropsWithChildren {
	r?: number;
	d?: number;
	$fn?: number;
}

export const Circle = (props: CircleProps) =>
	React.createElement(Primitive, { ...props, type: "circle" });
Circle.displayName = "Circle";

export function serialize(node: CircleNode, _indent: string, _ctx: SerializeContext): string {
	const rVal = node.r ?? 1;
	const dVal = node.d;
	let args = dVal != null ? `d = ${String(dVal)}` : `r = ${String(rVal)}`;
	if (node.$fn != null) args += `, $fn = ${node.$fn}`;
	return `circle(${args});`;
}
