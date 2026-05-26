import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST() {
  return NextResponse.json(
    { error: "API available on the server only" },
    { status: 503 }
  );
}
