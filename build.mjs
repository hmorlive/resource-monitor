import { build } from "esbuild";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Resolve __dirname from ESM context
const __dirname = dirname(fileURLToPath(import.meta.url));

// Paths
const publicDir = join(__dirname, "public");
const outDir = join(__dirname, "build", "public");

// Build main process
await build({
  entryPoints: [
    join(__dirname, "src", "main.ts"),
    join(__dirname, "src", "preload.ts"),
  ],
  outdir: join(__dirname, "build"),
  bundle: true,
  platform: "node",
  target: "node24",
  external: ["electron"],
  sourcemap: true,
  format: "cjs",
  minify: true,
});

console.log("✓ Main process built");

// Recursively copy public files to build
function copyPublic(srcDir, destDir) {
  mkdirSync(destDir, { recursive: true });
  const items = readdirSync(srcDir);
  for (const item of items) {
    const srcPath = join(srcDir, item);
    const destPath = join(destDir, item);
    if (statSync(srcPath).isDirectory()) {
      copyPublic(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

copyPublic(publicDir, outDir);
console.log("✓ Public assets copied");