const fs = require("fs");
const path = require("path");

const API_KEY = process.env.ANTHROPIC_API_KEY;
const DIR = "File for brend";

async function analyzeImage(filePath) {
  const img = fs.readFileSync(filePath);
  const base64 = img.toString("base64");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: base64,
              },
            },
            {
              type: "text",
              text: "Опиши это изображение подробно. Что это — макет сайта, логотип, упаковка? Какие цвета, шрифты, композиция? Весь текст который видишь — перепиши. Это для бренда чая «Дикая Тишь».",
            },
          ],
        },
      ],
    }),
  });

  const data = await res.json();
  if (data.error) return `ERROR: ${data.error.message}`;
  return data.content[0].text;
}

async function main() {
  const files = fs.readdirSync(DIR).filter((f) => /\.(png|jpg|jpeg|svg)$/i.test(f));
  console.log(`Found ${files.length} images\n`);

  for (const file of files) {
    const filePath = path.join(DIR, file);
    const sizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);
    console.log(`=== ${file} (${sizeMB} MB) ===`);
    try {
      const desc = await analyzeImage(filePath);
      console.log(desc);
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    console.log("\n---\n");
  }
}

main();
