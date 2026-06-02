import { mkdir, copyFile, writeFile, access, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distClientDir = path.join(rootDir, "dist", "client");
const faviconSource = path.join(rootDir, "Icons", "favicon.ico");
const faviconTarget = path.join(distClientDir, "Icons", "favicon.ico");

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const assetDir = path.join(distClientDir, "assets");
  const assetFiles = await readdir(assetDir);
  const entryFile = assetFiles.find((file) => file.startsWith("index-") && file.endsWith(".js"));
  const stylesheetFile = assetFiles.find((file) => file.startsWith("styles-") && file.endsWith(".css"));

  if (!entryFile) {
    throw new Error(`Missing client entry bundle in ${assetDir}`);
  }

  if (!stylesheetFile) {
    throw new Error(`Missing client stylesheet in ${assetDir}`);
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/Icons/favicon.ico" />
    <link rel="stylesheet" href="/assets/${stylesheetFile}" />
    <title>Scholarii — Modern School Management</title>
    <meta
      name="description"
      content="Replace Excel & WhatsApp with Scholarii. India's simplest school management system."
    />
    <meta property="og:title" content="Scholarii — Modern School Management" />
    <meta
      property="og:description"
      content="Role-based dashboards for principals, teachers, students, admins and parents."
    />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <script type="module" src="/assets/${entryFile}"></script>
  </body>
</html>`;

  await mkdir(distClientDir, { recursive: true });
  await writeFile(path.join(distClientDir, "index.html"), html, "utf8");

  if (await fileExists(faviconSource)) {
    await mkdir(path.dirname(faviconTarget), { recursive: true });
    await copyFile(faviconSource, faviconTarget);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
