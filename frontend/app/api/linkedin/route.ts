import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID!;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI!;
const SCOPE = 'openid profile email w_member_social';

export async function GET(req: NextRequest) {
  try {
    if (!CLIENT_ID || !REDIRECT_URI) {
      return NextResponse.json({ error: 'LinkedIn client ID or redirect URI not set.' }, { status: 500 });
    }
    const state = Math.random().toString(36).substring(2);
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}&state=${state}`;
    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start LinkedIn OAuth flow', details: (error as Error).message }, { status: 500 });
  }
}
