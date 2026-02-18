#!/usr/bin/env node

import { boolean, command, positional, run } from "@drizzle-team/brocli";
import { spawn } from "node:child_process";
import { access, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const EXAMPLE_REPO = "https://github.com/react-scad/example.git";

function sanitizePackageName(projectName: string): string {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function scaffold(opts: {
  projectName: string;
  noInstall: boolean;
}): Promise<void> {
  const { projectName, noInstall } = opts;

  const packageName = sanitizePackageName(projectName);

  if (!packageName) {
    throw new Error("Invalid project name. Use letters, numbers, and hyphens.");
  }

  const targetDir = resolve(process.cwd(), projectName);

  try {
    await access(targetDir);
    throw new Error(`Directory "${projectName}" already exists.`);
  } catch (err) {
    if (err instanceof Error && err.message.includes("already exists")) {
      throw err;
    }
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code !== "ENOENT") {
      throw err;
    }
  }

  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(
      "git",
      ["clone", "--depth", "1", EXAMPLE_REPO, targetDir],
      { stdio: "inherit" },
    );
    child.on("close", (code) =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`git clone exited with ${code}`)),
    );
  });

  await rm(join(targetDir, ".git"), { recursive: true, force: true });

  const pkgPath = join(targetDir, "package.json");
  const pkg = await readFile(pkgPath, "utf-8");
  const updatedPkg = pkg.replace(
    /"name":\s*"[^"]*"/,
    `"name": "${packageName}"`,
  );
  await writeFile(pkgPath, updatedPkg);

  console.log(`Created react-scad project in ./${projectName}/\n`);

  if (noInstall) {
    console.log("Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  npm install");
    console.log("  npm run dev");
  } else {
    console.log("Installing dependencies...");
    await new Promise<void>((resolvePromise, reject) => {
      const child = spawn("npm", ["install"], {
        cwd: targetDir,
        stdio: "inherit",
        shell: true,
      });
      child.on("close", (code) =>
        code === 0
          ? resolvePromise()
          : reject(new Error(`npm install exited with ${code}`)),
      );
    });
    console.log("");
    console.log("Done! Next steps:");
    console.log(`  cd ${projectName}`);
    console.log("  npm run dev");
  }

  console.log("");
  console.log("Then open model.scad in OpenSCAD to view your model.");
}

const createCommand = command({
  name: "new",
  desc: "Scaffold a new react-scad project",
  shortDesc: "Create a new react-scad project",
  options: {
    projectName: positional("project-name")
      .desc("Name of the project directory to create")
      .required(),
    noInstall: boolean("no-install")
      .desc("Skip running npm install after creating the project")
      .default(false),
  },
  handler: async (opts) => {
    await scaffold({
      projectName: opts.projectName,
      noInstall: opts.noInstall ?? false,
    });
  },
});

// Support both "create-react-scad my-app" and "create-react-scad new my-app"
const argv = process.argv.slice(2);
const first = argv[0];
const isNewCommand =
  first === "new" ||
  first === "-h" ||
  first === "--help" ||
  first === "-v" ||
  first === "--version";
const argSource = isNewCommand
  ? process.argv
  : [process.argv[0], process.argv[1], "new", ...argv];

run([createCommand], {
  name: "create-react-scad",
  description: "Scaffold a new react-scad project",
  version: "1.0.0",
  argSource,
});
