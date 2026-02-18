import type { ScadExpr, Vec2, Vec3 } from "./types.js";

export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = n.toFixed(6);
  return s.replace(/\.?0+$/, "");
}

export function formatScadExpr(x: ScadExpr): string {
  return typeof x === "number" ? formatNumber(x) : x;
}

export function formatVec2(v: Vec2): string {
  if (typeof v === "number" || typeof v === "string") return formatScadExpr(v);
  return `[${formatScadExpr(v[0])}, ${formatScadExpr(v[1])}]`;
}

export function formatVec3(v: Vec3): string {
  if (typeof v === "number" || typeof v === "string") return formatScadExpr(v);
  return `[${formatScadExpr(v[0])}, ${formatScadExpr(v[1])}, ${formatScadExpr(v[2])}]`;
}

export function formatPoints2D(points: [number, number][]): string {
  return `[${points.map((p) => `[${formatNumber(p[0])}, ${formatNumber(p[1])}]`).join(", ")}]`;
}

export function formatPoints3D(points: [number, number, number][]): string {
  return `[${points.map((p) => `[${formatNumber(p[0])}, ${formatNumber(p[1])}, ${formatNumber(p[2])}]`).join(", ")}]`;
}

export function formatFaces(faces: number[][]): string {
  return `[${faces.map((f) => `[${f.map(formatNumber).join(", ")}]`).join(", ")}]`;
}
