#!/usr/bin/env node

import { spawn } from "node:child_process";
import { unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";
import * as esbuild from "esbuild";

const pkgRoot = path.dirname(fileURLToPath(import.meta.url));
const reactScadMain = path.join(pkgRoot, "dist/index.js");

const args = process.argv.slice(2);
const watchMode = args.includes("--watch");
const entryArg = args.find((a) => a !== "--watch");

if (!entryArg) {
	console.error("Usage: react-scad <entry> [--watch]");
	console.error("  entry   Path to .jsx or .tsx file (e.g. ./examples/rocket/main.tsx)");
	console.error("  --watch Rebuild and run on file changes");
	process.exit(1);
}

const entry = path.resolve(process.cwd(), entryArg);
const outFile = path.join(
	tmpdir(),
	watchMode ? "react-scad-watch.js" : `react-scad-${Date.now()}.js`,
);

const reactScadResolver = {
	name: "react-scad-resolver",
	setup(build) {
		build.onResolve({ filter: /^(react-scad|@react-scad\/react-scad)(\/.*)?$/ }, () => ({
			path: reactScadMain,
		}));
	},
};

const buildOpts = {
	entryPoints: [entry],
	bundle: true,
	format: "esm",
	outfile: outFile,
	platform: "node",
	jsx: "automatic",
	plugins: [reactScadResolver],
};

function runScript() {
	return new Promise((resolve) => {
		const proc = spawn(process.execPath, [outFile], {
			stdio: "inherit",
			cwd: process.cwd(),
		});
		proc.on("close", (code) => resolve(code));
	});
}

async function buildAndRun() {
	try {
		await esbuild.build(buildOpts);
	} catch (err) {
		console.error(err);
		return false;
	}
	return runScript();
}

function cleanup() {
	try {
		unlinkSync(outFile);
	} catch (_) {}
}

if (watchMode) {
	// Use esbuild's watch so all resolved dependencies (entry + imports) trigger a rebuild
	const runPlugin = {
		name: "run-after-build",
		setup(build) {
			build.onEnd((result) => {
				if (result.errors.length > 0) return;
				runScript();
			});
		},
	};

	const ctx = await esbuild.context({
		...buildOpts,
		plugins: [...buildOpts.plugins, runPlugin],
	});

	console.log(`Watching ${entry} and dependencies…`);
	await ctx.watch();
	process.on("exit", cleanup);
} else {
	const code = await buildAndRun();
	cleanup();
	process.exit(typeof code === "number" ? code : 1);
}
