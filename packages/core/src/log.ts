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
	return new Date().toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
}

const TOOL_NAME = "react-scad";
const TS_PAD = "  "; // space after timestamp

function writeLogLine(line: string): void {
	console.log(line);
}

export const log = {
	banner(): void {
		console.log(`${c.bold(TOOL_NAME)}  ${c.dim("·")}  ${c.dim("Ctrl+C to exit")}`);
	},
	progress(msg: string): void {
		writeLogLine(`${c.dim(`[${time()}]`)}${TS_PAD}${c.yellow(msg)}`);
	},
	complete(ms: number): void {
		writeLogLine(`${c.dim(`[${time()}]`)}${TS_PAD}${c.green("Built")} ${c.dim(`(${ms}ms)`)}`);
	},
	written(path: string, ms: number): void {
		writeLogLine(
			`${c.dim(`[${time()}]`)}${TS_PAD}${c.green("Written")} ${c.dim(path)} ${c.dim(`(${ms}ms)`)}`,
		);
	},
	outputPath(path: string): void {
		writeLogLine(`${c.dim(`[${time()}]`)}${TS_PAD}${c.dim("Output")} ${c.cyan(path)}`);
	},
};
