const noColor = process.env.NO_COLOR != null || !process.stdout.isTTY;
export const c = {
	dim: (s: string) => (noColor ? s : `\x1b[2m${s}\x1b[0m`),
	cyan: (s: string) => (noColor ? s : `\x1b[36m${s}\x1b[0m`),
	green: (s: string) => (noColor ? s : `\x1b[32m${s}\x1b[0m`),
	red: (s: string) => (noColor ? s : `\x1b[31m${s}\x1b[0m`),
	yellow: (s: string) => (noColor ? s : `\x1b[33m${s}\x1b[0m`),
	bold: (s: string) => (noColor ? s : `\x1b[1m${s}\x1b[0m`),
};

function time(): string {
	return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export const log = {
	buildOk(ms: number): void {
		console.log(c.dim(`[${time()}] `) + c.green("✓ Built") + c.dim(` in ${ms}ms`));
	},
	wrote(path: string, ms: number): void {
		console.log(c.dim(`[${time()}] `) + c.green("✓ Wrote") + c.dim(` ${path} in ${ms}ms`));
	},
	watchCycle(ms: number, code: number | null): void {
		const ok = code === 0;
		const status = ok ? c.green("done") : c.red(`exit ${code}`);
		console.log(`  ${ok ? c.green("✓") : c.red("✗")}${c.dim(` ${ms}ms  `)}${status}`);
	},
};
