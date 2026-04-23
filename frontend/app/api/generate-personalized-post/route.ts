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
      let backendError = "Failed to generate personalized post";
      try {
        const errJson = await res.json();
        backendError = errJson?.detail || errJson?.error || backendError;
      } catch {
        // Keep generic fallback when backend response is not JSON.
      }
      return NextResponse.json({ error: backendError }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate personalized post" }, { status: 500 });
  }
}
