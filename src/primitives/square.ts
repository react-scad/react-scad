import * as React from "react";
import type { PropsWithChildren } from "react";
import type { SerializeContext, SquareNode, Vec2 } from "../types.js";
import { formatVec2 } from "../utils.js";
import { Primitive } from "./primitive.js";

export interface SquareProps extends PropsWithChildren {
  size?: Vec2;
  center?: boolean;
}

export const Square = (props: SquareProps) =>
  React.createElement(Primitive, { ...props, type: "square" });
Square.displayName = "Square";

export function serialize(
  node: SquareNode,
  _indent: string,
  _ctx: SerializeContext,
): string {
  const s =
    typeof node.size === "number"
      ? String(node.size)
      : typeof node.size === "string"
        ? node.size
        : formatVec2(node.size);
  return `square(size = ${s}, center = ${node.center});`;
}
