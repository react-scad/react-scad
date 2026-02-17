#!/usr/bin/env node

import { command, run, positional, boolean } from "@drizzle-team/brocli";
import { spawn } from "node:child_process";
import { unlinkSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";
import * as esbuild from "esbuild";

const cliRoot = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.join(cliRoot, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };

const noColor = process.env.NO_COLOR != null || !process.stdout.isTTY;
const c = {
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

const log = {
	header(): void {
		console.log();
		console.log(c.cyan("  ╭─────────────────────────────╮"));
		console.log(c.cyan("  │  ") + c.bold("react-scad") + c.cyan("                    │"));
		console.log(c.cyan("  ╰─────────────────────────────╯"));
		console.log();
	},
	buildStart(entryPath: string, watch = false): void {
		const rel = path.relative(process.cwd(), entryPath) || entryPath;
		console.log(
			c.dim(`[${time()}] `) +
				c.bold("Build") +
				c.dim(`  ${rel}`) +
				(watch ? c.yellow("  (watch)") : ""),
		);
	},
	buildOk(ms: number): void {
		console.log(c.dim(`[${time()}] `) + c.green("✓ Built") + c.dim(` in ${ms}ms`));
	},
	buildFail(err: unknown): void {
		console.log(c.dim(`[${time()}] `) + c.red("✗ Build failed"));
		console.error(err);
	},
	runStart(): void {
		console.log(c.dim(`[${time()}] `) + c.cyan("▶ Running") + c.dim(" …"));
		console.log(c.dim("  ─────────────────────────────"));
	},
	runEnd(code: number | null): void {
		console.log(c.dim("  ─────────────────────────────"));
		if (code === 0) {
			console.log(c.dim(`[${time()}] `) + c.green("✓ Done") + c.dim(` (exit ${code})`));
		} else {
			console.log(c.dim(`[${time()}] `) + c.red("✗ Exit") + c.dim(` ${code}`));
		}
		console.log();
	},
	watchIntro(entryPath: string): void {
		const rel = path.relative(process.cwd(), entryPath) || entryPath;
		console.log(c.bold("react-scad") + c.dim("  watching  ") + rel + c.dim("  ·  Ctrl+C to stop"));
	},
	watchCycle(ms: number, code: number | null): void {
		const ok = code === 0;
		const status = ok ? c.green("done") : c.red(`exit ${code}`);
		console.log(`  ${ok ? c.green("✓") : c.red("✗")}${c.dim(` ${ms}ms  `)}${status}`);
	},
};

function createReactScadResolver(entryDir: string): esbuild.Plugin {
	const require = createRequire(import.meta.url);
	const reactScadMain = require.resolve("@react-scad/core", {
		paths: [entryDir],
	});
	return {
		name: "react-scad-resolver",
		setup(build) {
			build.onResolve({ filter: /^(react-scad|@react-scad\/(?:core|react-scad))(\/.*)?$/ }, () => ({
				path: reactScadMain,
			}));
		},
	};
}

function runScript(outFile: string, quiet = false): Promise<number | null> {
	return new Promise((resolve) => {
		if (!quiet) {
			log.runStart();
		}
		const proc = spawn(process.execPath, [outFile], {
			stdio: "inherit",
			cwd: process.cwd(),
		});
		proc.on("close", (code) => {
			if (!quiet) {
				log.runEnd(code);
			}
			resolve(code);
		});
	});
}

function cleanup(outFile: string): void {
	try {
		unlinkSync(outFile);
	} catch {
		// ignore
	}
}

const runCommand = command({
	name: "run",
	aliases: ["r"],
	desc: "Build and run a React-SCAD entry file (.jsx or .tsx)",
	options: {
		entry: positional("entry")
			.desc("Path to .jsx or .tsx file (e.g. ./examples/rocket/main.tsx)")
			.required(),
		watch: boolean("watch").desc("Rebuild and run on file changes").alias("w").default(false),
	},
	handler: async (opts) => {
		const entry = path.resolve(process.cwd(), opts.entry);
		const watchMode = opts.watch;
		const outFile = path.join(
			tmpdir(),
			watchMode ? "react-scad-watch.mjs" : `react-scad-${Date.now()}.mjs`,
		);

		const entryDir = path.dirname(entry);
		const buildOpts: esbuild.BuildOptions = {
			entryPoints: [entry],
			bundle: true,
			format: "esm",
			outfile: outFile,
			platform: "node",
			jsx: "automatic",
			plugins: [createReactScadResolver(entryDir)],
		};

		async function buildAndRun(): Promise<number | null | false> {
			log.header();
			log.buildStart(entry, false);
			const t0 = Date.now();
			try {
				await esbuild.build(buildOpts);
				log.buildOk(Date.now() - t0);
			} catch (err) {
				log.buildFail(err);
				return false;
			}
			return runScript(outFile);
		}

		if (watchMode) {
			log.watchIntro(entry);

			let buildStartTime = 0;
			const runPlugin: esbuild.Plugin = {
				name: "run-after-build",
				setup(build) {
					build.onStart(() => {
						buildStartTime = Date.now();
					});
					build.onEnd((result) => {
						if (result.errors.length > 0) {
							log.buildFail(result.errors);
							return;
						}
						const ms = Date.now() - buildStartTime;
						runScript(outFile, true).then((code) => {
							log.watchCycle(ms, code);
						});
					});
				},
			};

			const ctx = await esbuild.context({
				...buildOpts,
				plugins: [...(buildOpts.plugins ?? []), runPlugin],
			});

			const t0 = Date.now();
			try {
				await esbuild.build(buildOpts);
				const code = await runScript(outFile, true);
				log.watchCycle(Date.now() - t0, code);
			} catch (err) {
				log.buildFail(err);
			}

			process.on("exit", () => cleanup(outFile));
			await ctx.watch();
		} else {
			const code = await buildAndRun();
			cleanup(outFile);
			process.exit(typeof code === "number" ? code : 1);
		}
	},
});

run([runCommand], {
	name: "react-scad",
	description: "Build and run React-SCAD entry files",
	version: pkg.version,
});
