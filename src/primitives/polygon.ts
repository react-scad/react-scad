import * as React from "react";
import type { PropsWithChildren } from "react";
import type { PolygonNode, SerializeContext } from "../types.js";
import { formatFaces, formatPoints2D } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface PolygonProps extends PropsWithChildren {
  points: [number, number][];
  paths?: number[][];
  convexity?: number;
}

export const Polygon = (props: PolygonProps) =>
  React.createElement(Primitive, { ...props, type: "polygon" });
Polygon.displayName = "Polygon";

export function serialize(
  node: PolygonNode,
  _indent: string,
  _ctx: SerializeContext,
): string {
  let args = `points = ${formatPoints2D(node.points)}`;
  if (node.paths != null && node.paths.length > 0) {
    args += `, paths = ${formatFaces(node.paths)}`;
  }
  if (node.convexity != null) args += `, convexity = ${node.convexity}`;
  return `polygon(${args});`;
}
