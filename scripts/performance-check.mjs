import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const manifestPath = path.join(root, "src", "data", "growthCityFrames.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const limits = {
  desktop: { totalBytes: 16 * 1024 * 1024, maxFrameBytes: 150 * 1024 },
  mobile: { totalBytes: 6 * 1024 * 1024, maxFrameBytes: 50 * 1024 },
};

const failures = [];

for (const kind of ["desktop", "mobile"]) {
  const config = manifest[kind];
  if (!config) {
    failures.push(`Missing ${kind} frame manifest`);
    continue;
  }

  const dir = path.join(root, "public", "growth-city", kind);
  const files = (await readdir(dir)).filter((name) => /^frame_\d+\.webp$/.test(name)).sort();
  if (files.length !== config.count) {
    failures.push(`${kind}: manifest expects ${config.count} frames, found ${files.length}`);
  }

  let total = 0;
  let largest = 0;
  let largestName = "";

  for (const name of files) {
    const size = (await stat(path.join(dir, name))).size;
    total += size;
    if (size > largest) {
      largest = size;
      largestName = name;
    }
  }

  const budget = limits[kind];
  if (total > budget.totalBytes) {
    failures.push(
      `${kind}: ${(total / 1024 / 1024).toFixed(2)} MB exceeds ${(budget.totalBytes / 1024 / 1024).toFixed(0)} MB sequence budget`,
    );
  }
  if (largest > budget.maxFrameBytes) {
    failures.push(
      `${kind}: ${largestName} is ${(largest / 1024).toFixed(1)} KB, above ${(budget.maxFrameBytes / 1024).toFixed(0)} KB frame budget`,
    );
  }

  console.log(
    `[perf] ${kind}: ${files.length} frames, ${(total / 1024 / 1024).toFixed(2)} MB total, ${(largest / 1024).toFixed(1)} KB largest`,
  );
}

if (manifest.desktop?.count !== manifest.mobile?.count) {
  failures.push("Desktop and mobile frame counts differ; scroll timelines would drift");
}

if (failures.length) {
  console.error("\nPerformance budget check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[perf] Growth City performance budgets passed.");
