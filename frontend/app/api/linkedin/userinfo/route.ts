import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('linkedin_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json({ authenticated: false });
  }
  // Try to fetch userinfo from LinkedIn
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    return NextResponse.json({ authenticated: false });
  }
  const profile = await res.json();
  return NextResponse.json({ authenticated: true, profile });
}
