import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linkedin-agent-backend.onrender.com';
    const res = await fetch(
      backendUrl + "/generate-personalized-content",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to generate personalized post" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate personalized post" }, { status: 500 });
  }
}
