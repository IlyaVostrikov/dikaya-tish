import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } }
  );
  if (!res.ok) return NextResponse.json({ error: "Unsplash error" }, { status: res.status });

  const data = await res.json();
  const photo = data.results?.[0];
  return NextResponse.json({
    url: photo?.urls?.regular ?? null,
    alt: photo?.alt_description ?? "",
    author: photo?.user?.name ?? "",
  });
}
