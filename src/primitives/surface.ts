import * as React from "react";
import type { PropsWithChildren } from "react";
import type { SerializeContext, SurfaceNode } from "../types.js";
import { Primitive } from "./primitive.js";

export interface SurfaceProps extends PropsWithChildren {
  file: string;
  center?: boolean;
  invert?: boolean;
  convexity?: number;
}

export const Surface = (props: SurfaceProps) =>
  React.createElement(Primitive, { ...props, type: "surface" });
Surface.displayName = "Surface";

function escapePath(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function serialize(
  node: SurfaceNode,
  _indent: string,
  _ctx: SerializeContext,
): string {
  const parts: string[] = [`file = "${escapePath(node.file)}"`];
  if (node.center === true) parts.push("center = true");
  if (node.invert === true) parts.push("invert = true");
  if (node.convexity != null) parts.push(`convexity = ${node.convexity}`);
  return `surface(${parts.join(", ")});`;
}
