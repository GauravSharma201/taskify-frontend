/**
 * Wrapper around `shadcn add` (use: npm run ui:add -- button dialog).
 *
 * shadcn's registry now ships `import { cn } from "cn"` and lists the `cn` npm
 * package as a dependency. We must use our own `cn` from `@/lib/utils`, which
 * knows the design-system utilities (text-body, shadow-card, ...); the generic
 * one would merge them wrongly. This script runs the CLI, then rewrites those
 * imports and removes the `cn` package again.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: npm run ui:add -- <component> [component...]");
  process.exit(1);
}

const run = (cmd) => spawnSync(cmd, { stdio: "inherit", shell: true });

const add = run(`npx shadcn@latest add ${args.join(" ")}`);
if (add.status !== 0) process.exit(add.status ?? 1);

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const fixed = [];
for (const dir of ["components", "hooks", "lib"]) {
  let files;
  try {
    files = walk(dir);
  } catch {
    continue; // folder doesn't exist yet
  }
  for (const file of files.filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
    const src = readFileSync(file, "utf8");
    const out = src.replaceAll(/from ["']cn["']/g, 'from "@/lib/utils"');
    if (out !== src) {
      writeFileSync(file, out);
      fixed.push(file);
    }
  }
}
if (fixed.length) console.log(`\nui:add: pointed cn imports at @/lib/utils in\n  ${fixed.join("\n  ")}`);

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
if (pkg.dependencies?.cn || pkg.devDependencies?.cn) {
  console.log("ui:add: removing the stray `cn` package");
  run("npm uninstall cn");
}

console.log("\nui:add: done. Now align the new files with our tokens and update docs/component-inventory.md.");
