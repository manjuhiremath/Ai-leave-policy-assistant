import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  const backend = process.env.BACKEND_URL; // e.g., http://localhost:8000
  if (!backend) {
    return NextResponse.json({ error: "BACKEND_URL not set" }, { status: 500 });
  }
  const r = await fetch(`${backend}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  return NextResponse.json(data, { status: r.status });
}
