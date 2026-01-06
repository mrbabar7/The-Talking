const fs = require("fs");
const path = require("path");

async function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  await fs.promises.rm(dir, { recursive: true, force: true });
}

async function copyDir(src, dest) {
  // Use fs.cp when available (Node 16.7+)
  if (fs.promises.cp) {
    await fs.promises.cp(src, dest, { recursive: true });
    return;
  }

  // Fallback recursive copy
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  try {
    const repoRoot = path.join(__dirname, "..");
    const clientDist = path.join(repoRoot, "client", "dist");
    const serverDist = path.join(repoRoot, "server", "dist");

    if (!fs.existsSync(clientDist)) {
      console.error(
        "client/dist not found. Run `npm run build` inside `client` first."
      );
      process.exit(1);
    }

    await rmDir(serverDist);
    await copyDir(clientDist, serverDist);
    console.log("Copied client/dist → server/dist");
  } catch (err) {
    console.error("Error copying client dist:", err);
    process.exit(1);
  }
}

main();
