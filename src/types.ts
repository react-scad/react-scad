export type ScadExpr = number | string;
export type Vec2 = [ScadExpr, ScadExpr] | ScadExpr;
export type Vec3 = [ScadExpr, ScadExpr, ScadExpr] | ScadExpr;
export type Fn = number | undefined;

export interface CubeNode {
  kind: "cube";
  size: Vec3;
  center: boolean;
  children: ScadNode[];
}

export interface SphereNode {
  kind: "sphere";
  r?: ScadExpr;
  d?: ScadExpr;
  $fn?: Fn;
  children: ScadNode[];
}

export interface CylinderNode {
  kind: "cylinder";
  h: ScadExpr;
  r1: ScadExpr;
  r2: ScadExpr;
  $fn?: Fn;
  children: ScadNode[];
}

export interface UnionNode {
  kind: "union";
  children: ScadNode[];
}

export interface DifferenceNode {
  kind: "difference";
  children: ScadNode[];
}

export interface IntersectionNode {
  kind: "intersection";
  children: ScadNode[];
}

export interface TranslateNode {
  kind: "translate";
  v: Vec3;
  children: ScadNode[];
}

export interface RotateNode {
  kind: "rotate";
  a: Vec3;
  v?: Vec3;
  children: ScadNode[];
}

export interface ScaleNode {
  kind: "scale";
  v: Vec3;
  children: ScadNode[];
}

export interface GroupNode {
  kind: "group";
  children: ScadNode[];
}

export interface RawNode {
  kind: "raw";
  code: string;
  children: ScadNode[];
}

export interface PolyhedronNode {
  kind: "polyhedron";
  points: [number, number, number][];
  faces: number[][];
  convexity?: number;
  children: ScadNode[];
}

export interface SquareNode {
  kind: "square";
  size: Vec2;
  center: boolean;
  children: ScadNode[];
}

export interface CircleNode {
  kind: "circle";
  r?: ScadExpr;
  d?: ScadExpr;
  $fn?: Fn;
  children: ScadNode[];
}

export interface PolygonNode {
  kind: "polygon";
  points: [number, number][];
  paths?: number[][];
  convexity?: number;
  children: ScadNode[];
}

export interface LinearExtrudeNode {
  kind: "linear_extrude";
  height: ScadExpr;
  center?: boolean;
  twist?: ScadExpr;
  scale?: Vec2 | ScadExpr;
  convexity?: number;
  slices?: number;
  $fn?: Fn;
  children: ScadNode[];
}

export interface RotateExtrudeNode {
  kind: "rotate_extrude";
  angle?: ScadExpr;
  convexity?: number;
  $fn?: Fn;
  children: ScadNode[];
}

export interface TextNode {
  kind: "text";
  text: string;
  size?: number;
  font?: string;
  halign?: "left" | "center" | "right";
  valign?: "top" | "center" | "baseline" | "bottom";
  direction?: "ltr" | "rtl" | "ttb" | "btt";
  language?: string;
  script?: string;
  spacing?: number;
  children: ScadNode[];
}

export interface SurfaceNode {
  kind: "surface";
  file: string;
  center?: boolean;
  invert?: boolean;
  convexity?: number;
  children: ScadNode[];
}

export interface ImportNode {
  kind: "import";
  file: string;
  convexity?: number;
  layer?: string;
  children: ScadNode[];
}

export interface UnknownNode {
  kind: "unknown";
  type: string;
  props: Record<string, unknown>;
  children: ScadNode[];
}

export type ScadNode =
  | CubeNode
  | SphereNode
  | CylinderNode
  | PolyhedronNode
  | SquareNode
  | CircleNode
  | PolygonNode
  | UnionNode
  | DifferenceNode
  | IntersectionNode
  | TranslateNode
  | RotateNode
  | ScaleNode
  | LinearExtrudeNode
  | RotateExtrudeNode
  | TextNode
  | SurfaceNode
  | ImportNode
  | GroupNode
  | RawNode
  | UnknownNode;

export interface ScadContainer {
  children: ScadNode[];
}

export interface SerializeContext {
  serializeNode: (node: ScadNode, indent: string) => string;
}
