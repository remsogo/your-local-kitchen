import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("src", "assets");

const jobs = [
  { input: "hero-bg.jpg", output: "hero-bg.webp", quality: 78, width: 1800 },
  { input: "logo_pizzatiq.jpg", output: "logo_pizzatiq.webp", quality: 84, width: 420 },
];

const run = async () => {
  for (const job of jobs) {
    const inputPath = path.join(assetsDir, job.input);
    const outputPath = path.join(assetsDir, job.output);
    if (!fs.existsSync(inputPath)) {
      console.warn(`[optimize-images] missing input: ${job.input}`);
      continue;
    }

    const image = sharp(inputPath).rotate();
    if (job.width) {
      image.resize({ width: job.width, withoutEnlargement: true });
    }
    await image.webp({ quality: job.quality, effort: 5 }).toFile(outputPath);
    console.log(`[optimize-images] wrote ${job.output}`);
  }
};

run().catch((error) => {
  console.error("[optimize-images] failed", error);
  process.exit(1);
});
