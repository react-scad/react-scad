import * as React from "react";
import type { PropsWithChildren } from "react";
import type { PolyhedronNode, SerializeContext } from "../types.js";
import { formatFaces, formatPoints3D } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface PolyhedronProps extends PropsWithChildren {
  points: [number, number, number][];
  faces: number[][];
  convexity?: number;
}

export const Polyhedron = (props: PolyhedronProps) =>
  React.createElement(Primitive, { ...props, type: "polyhedron" });
Polyhedron.displayName = "Polyhedron";

export function serialize(
  node: PolyhedronNode,
  _indent: string,
  _ctx: SerializeContext,
): string {
  let args = `points = ${formatPoints3D(node.points)}, faces = ${formatFaces(node.faces)}`;
  if (node.convexity != null) args += `, convexity = ${node.convexity}`;
  return `polyhedron(${args});`;
}
