const fs = require("fs");
const path = require("path");

const API_KEY = "89db6e1571be76b53d057ee6bca3abc7075fc651ca5f8701da9b27a2553262d9";
const OUT_DIR = path.join(__dirname, "..", "out");

function walk(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push({
        path: path.relative(OUT_DIR, full).replace(/\\/g, "/"),
        size: stat.size,
        full,
      });
    }
  }
  return files;
}

const CONTENT_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[ext] || "application/octet-stream";
}

async function main() {
  const files = walk(OUT_DIR);
  console.log(`Found ${files.length} files`);

  // Build a lookup by path
  const fileByPath = {};
  for (const f of files) {
    fileByPath[f.path] = f;
  }

  // Step 1: Initiate publish
  const manifest = files.map((f) => ({
    path: f.path,
    size: f.size,
    contentType: contentType(f.path),
  }));

  console.log("Initiating publish...");
  const initRes = await fetch("https://here.now/api/v1/publish", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files: manifest }),
  });

  if (!initRes.ok) {
    const err = await initRes.json();
    console.error("Init failed:", JSON.stringify(err, null, 2));
    process.exit(1);
  }

  const body = await initRes.json();
  const siteUrl = body.siteUrl;
  const versionId = body.upload.versionId;
  const uploads = body.upload.uploads || [];
  const finalizeUrl = body.upload.finalizeUrl;

  console.log(`Site: ${siteUrl}`);
  console.log(`Version: ${versionId}`);
  console.log(`Files to upload: ${uploads.length}`);

  // Step 2: Upload files
  let uploaded = 0;
  let skipped = 0;
  for (const u of uploads) {
    if (u.skipped) {
      skipped++;
      continue;
    }
    const local = fileByPath[u.path];
    if (!local) {
      console.log(`  WARN: ${u.path} not in build output`);
      continue;
    }

    const content = fs.readFileSync(local.full);
    process.stdout.write(`  Uploading ${u.path} (${local.size}b)... `);
    const upRes = await fetch(u.url, {
      method: u.method || "PUT",
      headers: { ...(u.headers || {}), "Content-Type": contentType(u.path) },
      body: content,
    });
    if (!upRes.ok) {
      console.log(`FAIL ${upRes.status}`);
      console.error(await upRes.text());
      process.exit(1);
    }
    console.log("OK");
    uploaded++;
  }

  console.log(`Uploaded ${uploaded}, skipped ${skipped}`);

  // Step 3: Finalize
  if (!finalizeUrl) {
    console.log("No finalizeUrl — site may be auto-finalized");
    console.log(`Done: ${siteUrl}`);
    return;
  }

  console.log("Finalizing...");
  const finalRes = await fetch(finalizeUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ versionId }),
  });

  if (!finalRes.ok) {
    const err = await finalRes.json();
    console.error("Finalize failed:", JSON.stringify(err, null, 2));
    process.exit(1);
  }

  const result = await finalRes.json();
  console.log(`\nDeployed! ${result.siteUrl || siteUrl}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
