import { mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distClientDir = path.join(rootDir, "dist", "client");
const iconsSourceDir = path.join(rootDir, "Icons");
const iconsTargetDir = path.join(distClientDir, "Icons");
const staticIcons = ["favicon.ico", "apple-touch-icon.png"];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await fileExists(path.join(distClientDir, "index.html")))) {
    throw new Error(
      "Missing dist/client/index.html. Enable tanstackStart.spa in vite.config.ts.",
    );
  }

  await mkdir(iconsTargetDir, { recursive: true });

  for (const icon of staticIcons) {
    const source = path.join(iconsSourceDir, icon);
    if (!(await fileExists(source))) continue;
    await copyFile(source, path.join(iconsTargetDir, icon));
  }

  const faviconSource = path.join(iconsSourceDir, "favicon.ico");
  if (await fileExists(faviconSource)) {
    await copyFile(faviconSource, path.join(distClientDir, "favicon.ico"));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
