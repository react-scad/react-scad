import * as React from "react";
import type { PropsWithChildren } from "react";
import type { SerializeContext, SphereNode } from "../types.js";
import { formatScadExpr } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface SphereProps extends PropsWithChildren {
	r?: number;
	d?: number;
	$fn?: number;
}

export const Sphere = (props: SphereProps) =>
	React.createElement(Primitive, { ...props, type: "sphere" });
Sphere.displayName = "Sphere";

export function serialize(node: SphereNode, _indent: string, _ctx: SerializeContext): string {
	const rVal = node.r ?? 1;
	const dVal = node.d;
	let args = dVal != null ? `d = ${formatScadExpr(dVal)}` : `r = ${formatScadExpr(rVal)}`;
	if (node.$fn != null) args += `, $fn = ${node.$fn}`;
	return `sphere(${args});`;
}
