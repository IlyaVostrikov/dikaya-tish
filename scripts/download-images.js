const fs = require("fs");
const path = require("path");
const https = require("https");

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) {
  console.error("Set UNSPLASH_ACCESS_KEY env var");
  process.exit(1);
}

const QUERIES = [
  // Countries
  "caucasus mountains nature landscape",
  "tea plantation china",
  "shizuoka green tea field japan",
  "taiwan tea plantation alishan",
  "kenya tea plantation field",
  "darjeeling tea plantation india",
  "provence herb field france landscape",
  // Products — main
  "alishan taiwan mountain tea plantation mist",
  "fujian china tea garden hills",
  "altai siberia pine forest wild nature",
  "altai wildflower meadow blooming summer",
  "rooibos bush south africa landscape",
  "provence lavender rows sunset purple",
  // Products — gallery
  "oolong tea dry leaves twisted closeup",
  "tea brewing process cup pouring",
  "taiwan mountain landscape green hills",
  "tieguanyin oolong tea leaf closeup",
  "ceramic teapot tea ceremony pouring",
  "fujian terraced tea fields fog",
  "dried medicinal herbs bundle closeup",
  "lingonberry berries leaves forest floor",
  "herbal tea brewing glass cup",
  "dried pressed flowers botanical specimen",
  "chamomile cornflower wild herbs bundle",
  "glass teapot floral brew sunlight",
  "chamomile flowers field white petals",
  "rooibos tea dried leaves wooden bowl",
  "evening tea cup candle cozy",
  "dried lavender bundle rustic wooden table",
  "lemon balm melissa herb leaves green",
  "lavender tea cup steam morning",
  // Fermentation
  "green tea processing china",
  "white tea buds withering",
  "yellow tea china",
  "oolong tea rolling processing",
  "black tea processing fermentation",
  "puerh tea fermentation pile",
  // Hero
  "misty forest mountain dark atmospheric",
];

const OUT_DIR = path.join(__dirname, "..", "public", "images");
fs.mkdirSync(OUT_DIR, { recursive: true });

function slugify(q) {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400) {
          https.get(res.headers.location, (r2) => {
            r2.pipe(file);
            file.on("finish", () => { file.close(); resolve(); });
          });
          return;
        }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      })
      .on("error", reject);
  });
}

async function fetchPhoto(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  const data = await res.json();
  return data.results?.[0]?.urls?.regular ?? null;
}

async function main() {
  for (let i = 0; i < QUERIES.length; i++) {
    const q = QUERIES[i];
    const slug = slugify(q);
    const dest = path.join(OUT_DIR, `${slug}.jpg`);

    if (fs.existsSync(dest)) {
      console.log(`[${i + 1}/${QUERIES.length}] SKIP ${q} → ${slug}.jpg (exists)`);
      continue;
    }

    console.log(`[${i + 1}/${QUERIES.length}] FETCH ${q}...`);
    try {
      const url = await fetchPhoto(q);
      if (!url) {
        console.log(`  → No result`);
        continue;
      }
      await download(url, dest);
      console.log(`  → ${slug}.jpg`);
    } catch (e) {
      console.log(`  → Error: ${e.message}`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("\nDone!");
}

main();
