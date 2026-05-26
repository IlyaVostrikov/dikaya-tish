const fs = require("fs");
const path = require("path");
const https = require("https");

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) { console.error("Set UNSPLASH_ACCESS_KEY"); process.exit(1); }

// Map: original query → desired filename
const MISSING = {
  "altai wildflower meadow blooming summer": "altai-wildflower-meadow-blooming-summer.jpg",
  "rooibos bush south africa landscape": "rooibos-bush-south-africa-landscape.jpg",
  "taiwan mountain landscape green hills": "taiwan-mountain-landscape-green-hills.jpg",
  "tieguanyin oolong tea leaf closeup": "tieguanyin-oolong-tea-leaf-closeup.jpg",
  "lemon balm melissa herb leaves green": "lemon-balm-melissa-herb-leaves-green.jpg",
};

const ALTERNATIVES = {
  "altai wildflower meadow blooming summer": "rural wildflower meadow summer field",
  "rooibos bush south africa landscape": "south africa mountain landscape nature",
  "taiwan mountain landscape green hills": "taiwan mountain landscape forest",
  "tieguanyin oolong tea leaf closeup": "green tea leaves closeup macro",
  "lemon balm melissa herb leaves green": "green herb plant leaves garden fresh",
};

const OUT_DIR = path.join(__dirname, "..", "public", "images");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        https.get(res.headers.location, (r2) => {
          r2.pipe(file);
          file.on("finish", () => { file.close(); resolve(); });
        });
        return;
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function fetchPhoto(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  const data = await res.json();
  return data.results?.[0]?.urls?.regular ?? null;
}

async function main() {
  const entries = Object.entries(MISSING);
  for (let i = 0; i < entries.length; i++) {
    const [origQuery, filename] = entries[i];
    const dest = path.join(OUT_DIR, filename);
    if (fs.existsSync(dest)) { console.log(`SKIP ${filename} (exists)`); continue; }

    const altQuery = ALTERNATIVES[origQuery] || origQuery;
    console.log(`FETCH "${altQuery}" → ${filename}`);
    try {
      const url = await fetchPhoto(altQuery);
      if (!url) { console.log("  → No result"); continue; }
      await download(url, dest);
      console.log("  → OK");
    } catch (e) { console.log(`  → Error: ${e.message}`); }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log("Done!");
}
main();
