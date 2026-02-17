import type { Vec3 } from "./types.js";

export function formatVec3(v: Vec3): string {
	if (typeof v === "number" || typeof v === "string") return String(v);
	return `[${String(v[0])}, ${String(v[1])}, ${String(v[2])}]`;
}
