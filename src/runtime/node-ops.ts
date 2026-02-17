import type { ScadContainer, ScadNode, Vec2, Vec3 } from "../types.js";

const DEFAULT_VEC3: Vec3 = [0, 0, 0];
const DEFAULT_SCALE: Vec3 = [1, 1, 1];

function toScadExpr(x: unknown): number | string {
  if (typeof x === "string") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function toVec2(v: unknown): Vec2 {
  if (typeof v === "number") return v;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length >= 2)
    return [toScadExpr(v[0]), toScadExpr(v[1])];
  return 1;
}

function toVec3(v: unknown): Vec3 {
  if (typeof v === "number") return v;
  if (typeof v === "string") return v;
  if (Array.isArray(v) && v.length >= 3)
    return [toScadExpr(v[0]), toScadExpr(v[1]), toScadExpr(v[2])];
  return DEFAULT_VEC3;
}

function num(x: unknown, fallback: number): number {
  if (typeof x === "string") return fallback;
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function numOrExpr(x: unknown, fallback: number): number | string {
  if (typeof x === "string") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function bool(x: unknown, fallback: boolean): boolean {
  if (typeof x === "boolean") return x;
  return fallback;
}

function toPoints3D(v: unknown): [number, number, number][] {
  if (!Array.isArray(v)) return [];
  return v.map((p) => {
    if (!Array.isArray(p) || p.length < 3)
      return [0, 0, 0] as [number, number, number];
    return [num(p[0], 0), num(p[1], 0), num(p[2], 0)];
  });
}

function toPoints2D(v: unknown): [number, number][] {
  if (!Array.isArray(v)) return [];
  return v.map((p) => {
    if (!Array.isArray(p) || p.length < 2) return [0, 0] as [number, number];
    return [num(p[0], 0), num(p[1], 0)];
  });
}

function toFaces(v: unknown): number[][] {
  if (!Array.isArray(v)) return [];
  return v.map((f) => (Array.isArray(f) ? f.map((i) => num(i, 0)) : []));
}

export function createScadNode(
  type: string,
  props: Record<string, unknown>,
): ScadNode {
  const children: ScadNode[] = [];
  switch (type) {
    case "cube": {
      const size = props.size ?? 1;
      return {
        kind: "cube",
        size: typeof size === "number" ? size : toVec3(size),
        center: bool(props.center, false),
        children,
      };
    }
    case "sphere":
      return {
        kind: "sphere",
        r:
          props.r != null
            ? numOrExpr(props.r, 1)
            : props.radius != null
              ? numOrExpr(props.radius, 1)
              : undefined,
        d:
          props.d != null
            ? numOrExpr(props.d, 2)
            : props.diameter != null
              ? numOrExpr(props.diameter, 2)
              : undefined,
        $fn:
          props.$fn != null
            ? num(props.$fn, 0)
            : props.fn != null
              ? num(props.fn, 0)
              : undefined,
        children,
      };
    case "cylinder": {
      const r1 = props.r1 ?? props.r ?? props.radius ?? 1;
      const r2 = props.r2 ?? r1;
      return {
        kind: "cylinder",
        h: numOrExpr(props.h ?? props.height, 1),
        r1: numOrExpr(r1, 1),
        r2: numOrExpr(r2, 1),
        $fn:
          props.$fn != null
            ? num(props.$fn, 0)
            : props.fn != null
              ? num(props.fn, 0)
              : undefined,
        children,
      };
    }
    case "union":
      return { kind: "union", children };
    case "difference":
      return { kind: "difference", children };
    case "intersection":
      return { kind: "intersection", children };
    case "translate":
      return {
        kind: "translate",
        v: toVec3(props.v ?? props.vector ?? DEFAULT_VEC3),
        children,
      };
    case "rotate":
      return {
        kind: "rotate",
        a: toVec3(props.a ?? props.angle ?? props.angles ?? DEFAULT_VEC3),
        v:
          props.v != null || props.vector != null
            ? toVec3(props.v ?? props.vector)
            : undefined,
        children,
      };
    case "scale":
      return {
        kind: "scale",
        v: toVec3(props.v ?? props.vector ?? DEFAULT_SCALE),
        children,
      };
    case "group":
      return { kind: "group", children };
    case "raw":
      return {
        kind: "raw",
        code: props.code != null ? String(props.code) : "",
        children,
      };
    case "polyhedron":
      return {
        kind: "polyhedron",
        points: toPoints3D(props.points ?? []),
        faces: toFaces(props.faces ?? []),
        convexity:
          props.convexity != null ? num(props.convexity, 1) : undefined,
        children,
      };
    case "square": {
      const size = props.size ?? 1;
      return {
        kind: "square",
        size: typeof size === "number" ? size : toVec2(size),
        center: bool(props.center, false),
        children,
      };
    }
    case "circle":
      return {
        kind: "circle",
        r: props.r != null ? numOrExpr(props.r, 1) : undefined,
        d: props.d != null ? numOrExpr(props.d, 2) : undefined,
        $fn: props.$fn != null ? num(props.$fn, 0) : undefined,
        children,
      };
    case "polygon":
      return {
        kind: "polygon",
        points: toPoints2D(props.points ?? []),
        paths: props.paths != null ? toFaces(props.paths) : undefined,
        convexity:
          props.convexity != null ? num(props.convexity, 1) : undefined,
        children,
      };
    case "linear_extrude": {
      const scale = props.scale;
      return {
        kind: "linear_extrude",
        height: numOrExpr(props.height ?? props.h, 1),
        center: props.center === true,
        twist: props.twist != null ? numOrExpr(props.twist, 0) : undefined,
        scale:
          scale != null
            ? typeof scale === "number" || typeof scale === "string"
              ? scale
              : toVec2(scale)
            : undefined,
        convexity:
          props.convexity != null ? num(props.convexity, 1) : undefined,
        slices: props.slices != null ? num(props.slices, 0) : undefined,
        $fn: props.$fn != null ? num(props.$fn, 0) : undefined,
        children,
      };
    }
    case "rotate_extrude":
      return {
        kind: "rotate_extrude",
        angle: props.angle != null ? numOrExpr(props.angle, 360) : undefined,
        convexity:
          props.convexity != null ? num(props.convexity, 1) : undefined,
        $fn: props.$fn != null ? num(props.$fn, 0) : undefined,
        children,
      };
    case "text":
      return {
        kind: "text",
        text:
          props.text != null
            ? String(props.text)
            : props.t != null
              ? String(props.t)
              : "",
        size: props.size != null ? num(props.size, 10) : undefined,
        font: props.font != null ? String(props.font) : undefined,
        halign:
          props.halign != null
            ? (props.halign as "left" | "center" | "right")
            : undefined,
        valign:
          props.valign != null
            ? (props.valign as "top" | "center" | "baseline" | "bottom")
            : undefined,
        direction:
          props.direction != null
            ? (props.direction as "ltr" | "rtl" | "ttb" | "btt")
            : undefined,
        language: props.language != null ? String(props.language) : undefined,
        script: props.script != null ? String(props.script) : undefined,
        spacing: props.spacing != null ? num(props.spacing, 1) : undefined,
        children,
      };
    case "surface":
      return {
        kind: "surface",
        file:
          props.file != null
            ? String(props.file)
            : props.filename != null
              ? String(props.filename)
              : "",
        center: props.center === true,
        invert: props.invert === true,
        convexity:
          props.convexity != null ? num(props.convexity, 1) : undefined,
        children,
      };
    case "import":
      return {
        kind: "import",
        file:
          props.file != null
            ? String(props.file)
            : props.filename != null
              ? String(props.filename)
              : "",
        convexity:
          props.convexity != null ? num(props.convexity, 1) : undefined,
        layer: props.layer != null ? String(props.layer) : undefined,
        children,
      };
    default:
      return { kind: "unknown", type, props: { ...props }, children };
  }
}

export function updateScadNode(
  node: ScadNode,
  nextProps: Record<string, unknown>,
): void {
  switch (node.kind) {
    case "cube": {
      const size = nextProps.size ?? node.size;
      node.size = typeof size === "number" ? size : toVec3(size);
      node.center = bool(nextProps.center, node.center);
      break;
    }
    case "sphere":
      if (nextProps.r != null) node.r = numOrExpr(nextProps.r, 1);
      if (nextProps.radius != null) node.r = numOrExpr(nextProps.radius, 1);
      if (nextProps.d != null) node.d = numOrExpr(nextProps.d, 2);
      if (nextProps.diameter != null) node.d = numOrExpr(nextProps.diameter, 2);
      if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
      if (nextProps.fn != null) node.$fn = num(nextProps.fn, 0);
      break;
    case "cylinder":
      node.h = numOrExpr(nextProps.h ?? nextProps.height ?? node.h, 1);
      if (nextProps.r1 != null) node.r1 = numOrExpr(nextProps.r1, 1);
      if (nextProps.r != null) node.r1 = numOrExpr(nextProps.r, 1);
      if (nextProps.radius != null) node.r1 = numOrExpr(nextProps.radius, 1);
      if (nextProps.r2 != null)
        node.r2 = numOrExpr(
          nextProps.r2,
          typeof node.r1 === "number" ? node.r1 : 1,
        );
      if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
      if (nextProps.fn != null) node.$fn = num(nextProps.fn, 0);
      break;
    case "translate":
      node.v = toVec3(nextProps.v ?? nextProps.vector ?? node.v);
      break;
    case "rotate":
      node.a = toVec3(
        nextProps.a ?? nextProps.angle ?? nextProps.angles ?? node.a,
      );
      if (nextProps.v != null || nextProps.vector != null)
        node.v = toVec3(nextProps.v ?? nextProps.vector);
      break;
    case "scale":
      node.v = toVec3(nextProps.v ?? nextProps.vector ?? node.v);
      break;
    case "raw":
      if (nextProps.code != null) node.code = String(nextProps.code);
      break;
    case "polyhedron":
      if (nextProps.points != null) node.points = toPoints3D(nextProps.points);
      if (nextProps.faces != null) node.faces = toFaces(nextProps.faces);
      if (nextProps.convexity != null)
        node.convexity = num(nextProps.convexity, 1);
      break;
    case "square": {
      const size = nextProps.size ?? node.size;
      node.size = typeof size === "number" ? size : toVec2(size);
      node.center = bool(nextProps.center, node.center);
      break;
    }
    case "circle":
      if (nextProps.r != null) node.r = numOrExpr(nextProps.r, 1);
      if (nextProps.d != null) node.d = numOrExpr(nextProps.d, 2);
      if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
      break;
    case "polygon":
      if (nextProps.points != null) node.points = toPoints2D(nextProps.points);
      if (nextProps.paths != null) node.paths = toFaces(nextProps.paths);
      if (nextProps.convexity != null)
        node.convexity = num(nextProps.convexity, 1);
      break;
    case "linear_extrude":
      node.height = numOrExpr(
        nextProps.height ?? nextProps.h ?? node.height,
        1,
      );
      if (nextProps.center !== undefined)
        node.center = nextProps.center === true;
      if (nextProps.twist != null) node.twist = numOrExpr(nextProps.twist, 0);
      if (nextProps.scale != null)
        node.scale =
          typeof nextProps.scale === "number" ||
          typeof nextProps.scale === "string"
            ? nextProps.scale
            : toVec2(nextProps.scale);
      if (nextProps.convexity != null)
        node.convexity = num(nextProps.convexity, 1);
      if (nextProps.slices != null) node.slices = num(nextProps.slices, 0);
      if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
      break;
    case "rotate_extrude":
      if (nextProps.angle != null) node.angle = numOrExpr(nextProps.angle, 360);
      if (nextProps.convexity != null)
        node.convexity = num(nextProps.convexity, 1);
      if (nextProps.$fn != null) node.$fn = num(nextProps.$fn, 0);
      break;
    case "text":
      if (nextProps.text != null) node.text = String(nextProps.text);
      if (nextProps.t != null) node.text = String(nextProps.t);
      if (nextProps.size != null) node.size = num(nextProps.size, 10);
      if (nextProps.font != null) node.font = String(nextProps.font);
      if (nextProps.halign != null)
        node.halign = nextProps.halign as "left" | "center" | "right";
      if (nextProps.valign != null)
        node.valign = nextProps.valign as
          | "top"
          | "center"
          | "baseline"
          | "bottom";
      if (nextProps.direction != null)
        node.direction = nextProps.direction as "ltr" | "rtl" | "ttb" | "btt";
      if (nextProps.language != null)
        node.language = String(nextProps.language);
      if (nextProps.script != null) node.script = String(nextProps.script);
      if (nextProps.spacing != null) node.spacing = num(nextProps.spacing, 1);
      break;
    case "surface":
      if (nextProps.file != null) node.file = String(nextProps.file);
      if (nextProps.filename != null) node.file = String(nextProps.filename);
      if (nextProps.center !== undefined)
        node.center = nextProps.center === true;
      if (nextProps.invert !== undefined)
        node.invert = nextProps.invert === true;
      if (nextProps.convexity != null)
        node.convexity = num(nextProps.convexity, 1);
      break;
    case "import":
      if (nextProps.file != null) node.file = String(nextProps.file);
      if (nextProps.filename != null) node.file = String(nextProps.filename);
      if (nextProps.convexity != null)
        node.convexity = num(nextProps.convexity, 1);
      if (nextProps.layer != null) node.layer = String(nextProps.layer);
      break;
    case "unknown":
      node.props = { ...nextProps };
      break;
    default:
      break;
  }
}

export function cloneScadNode(node: ScadNode, keepChildren: boolean): ScadNode {
  const children = keepChildren
    ? node.children.map((c) => cloneScadNode(c, true))
    : [];
  switch (node.kind) {
    case "cube":
      return { kind: "cube", size: node.size, center: node.center, children };
    case "sphere":
      return { kind: "sphere", r: node.r, d: node.d, $fn: node.$fn, children };
    case "cylinder":
      return {
        kind: "cylinder",
        h: node.h,
        r1: node.r1,
        r2: node.r2,
        $fn: node.$fn,
        children,
      };
    case "union":
      return { kind: "union", children };
    case "difference":
      return { kind: "difference", children };
    case "intersection":
      return { kind: "intersection", children };
    case "translate":
      return { kind: "translate", v: node.v, children };
    case "rotate":
      return { kind: "rotate", a: node.a, v: node.v, children };
    case "scale":
      return { kind: "scale", v: node.v, children };
    case "group":
      return { kind: "group", children };
    case "raw":
      return { kind: "raw", code: node.code, children };
    case "polyhedron":
      return {
        kind: "polyhedron",
        points: node.points.map((p) => [...p] as [number, number, number]),
        faces: node.faces.map((f) => [...f]),
        convexity: node.convexity,
        children,
      };
    case "square":
      return { kind: "square", size: node.size, center: node.center, children };
    case "circle":
      return { kind: "circle", r: node.r, d: node.d, $fn: node.$fn, children };
    case "polygon":
      return {
        kind: "polygon",
        points: node.points.map((p) => [...p] as [number, number]),
        paths: node.paths?.map((f) => [...f]),
        convexity: node.convexity,
        children,
      };
    case "linear_extrude":
      return {
        kind: "linear_extrude",
        height: node.height,
        center: node.center,
        twist: node.twist,
        scale: node.scale,
        convexity: node.convexity,
        slices: node.slices,
        $fn: node.$fn,
        children,
      };
    case "rotate_extrude":
      return {
        kind: "rotate_extrude",
        angle: node.angle,
        convexity: node.convexity,
        $fn: node.$fn,
        children,
      };
    case "text":
      return {
        kind: "text",
        text: node.text,
        size: node.size,
        font: node.font,
        halign: node.halign,
        valign: node.valign,
        direction: node.direction,
        language: node.language,
        script: node.script,
        spacing: node.spacing,
        children,
      };
    case "surface":
      return {
        kind: "surface",
        file: node.file,
        center: node.center,
        invert: node.invert,
        convexity: node.convexity,
        children,
      };
    case "import":
      return {
        kind: "import",
        file: node.file,
        convexity: node.convexity,
        layer: node.layer,
        children,
      };
    case "unknown":
      return {
        kind: "unknown",
        type: node.type,
        props: { ...node.props },
        children,
      };
  }
}

export function createScadContainer(): ScadContainer {
  return { children: [] };
}
