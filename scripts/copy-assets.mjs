import fs from "fs/promises";
import path from "path";

async function copy(srcRel, destRel) {
  const root = path.resolve(process.cwd());
  const src = path.join(root, srcRel);
  const dest = path.join(root, destRel);
  try {
    await fs.copyFile(src, dest);
    console.log(`Copied ${srcRel} -> ${destRel}`);
  } catch (err) {
    console.warn(`Skipping ${srcRel} -> ${destRel}: ${err.message}`);
  }
}

async function main() {
  // Files to copy: [sourceRelative, destRelative]
  const files = [
    ["src/assets/images/favicon.png", "public/favicon.png"],
    ["src/assets/images/logo.png", "public/og-image.png"],
  ];

  for (const [s, d] of files) {
    await copy(s, d);
  }
}

main().catch((err) => {
  console.error("copy-assets failed", err);
  process.exit(1);
});
