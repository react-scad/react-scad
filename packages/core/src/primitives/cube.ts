import * as React from "react";
import type { PropsWithChildren } from "react";
import type { CubeNode, SerializeContext, Vec3 } from "../types.js";
import { formatScadExpr, formatVec3 } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface CubeProps extends PropsWithChildren {
	size?: Vec3;
	center?: boolean;
}

export const Cube = (props: CubeProps) =>
	React.createElement(Primitive, { ...props, type: "cube" });
Cube.displayName = "Cube";

export function serialize(node: CubeNode, _indent: string, _ctx: SerializeContext): string {
	const s =
		typeof node.size === "number"
			? formatScadExpr(node.size)
			: typeof node.size === "string"
				? node.size
				: formatVec3(node.size);
	return `cube(size = ${s}, center = ${node.center});`;
}
