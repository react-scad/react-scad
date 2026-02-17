import type { Vec2, Vec3 } from "./types.js";

export function formatVec2(v: Vec2): string {
  if (typeof v === "number" || typeof v === "string") return String(v);
  return `[${String(v[0])}, ${String(v[1])}]`;
}

export function formatVec3(v: Vec3): string {
  if (typeof v === "number" || typeof v === "string") return String(v);
  return `[${String(v[0])}, ${String(v[1])}, ${String(v[2])}]`;
}

export function formatPoints2D(points: [number, number][]): string {
  return `[${points.map((p) => `[${p[0]}, ${p[1]}]`).join(", ")}]`;
}

export function formatPoints3D(points: [number, number, number][]): string {
  return `[${points.map((p) => `[${p[0]}, ${p[1]}, ${p[2]}]`).join(", ")}]`;
}

export function formatFaces(faces: number[][]): string {
  return `[${faces.map((f) => `[${f.join(", ")}]`).join(", ")}]`;
}
