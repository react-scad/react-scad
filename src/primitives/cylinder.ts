import * as React from "react";
import type { PropsWithChildren } from "react";
import type { CylinderNode, SerializeContext } from "../types.js";
import { Primitive } from "./primitive.js";

export interface CylinderProps extends PropsWithChildren {
	h?: number;
	r1?: number;
	r2?: number;
	r?: number;
	$fn?: number;
}

export const Cylinder = (props: CylinderProps) =>
	React.createElement(Primitive, { ...props, type: "cylinder" });
Cylinder.displayName = "Cylinder";

export function serialize(node: CylinderNode, _indent: string, _ctx: SerializeContext): string {
	let args = `h = ${String(node.h)}, r1 = ${String(node.r1)}, r2 = ${String(node.r2)}`;
	if (node.$fn != null) args += `, $fn = ${node.$fn}`;
	return `cylinder(${args});`;
}
