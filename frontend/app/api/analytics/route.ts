import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/analytics");
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
    }
    const data = await res.json();
    // The backend returns { recent_posts: [...] } or similar
    return NextResponse.json(data.post_analytics || data || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
