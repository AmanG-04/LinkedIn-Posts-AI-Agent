import { NextRequest, NextResponse } from 'next/server';

// LinkedIn API endpoint for sharing posts (new Posts API)
const LINKEDIN_POSTS_URL = 'https://api.linkedin.com/rest/posts';

export async function POST(req: NextRequest) {
  // Get access token from cookie
  const accessToken = req.cookies.get('linkedin_access_token')?.value;
  if (!accessToken) {
    return NextResponse.json({ error: 'No LinkedIn access token found. Please login first.' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'No post text provided.' }, { status: 400 });
  }
  // Debug: Log the full post content being sent to LinkedIn
  console.log('LinkedIn post content:', text);

  // Get the user's LinkedIn ID (OpenID Connect userinfo, use 'sub' as id)
  const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  let profile;
  let profileText = await profileRes.text();
  try {
    profile = JSON.parse(profileText);
  } catch {
    profile = null;
  }
  if (!profileRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch LinkedIn profile.', details: profile || profileText, status: profileRes.status }, { status: 400 });
  }
  if (!profile || !profile.sub) {
    return NextResponse.json({ error: 'LinkedIn userinfo response missing sub (id).', details: profile || profileText }, { status: 400 });
  }

  // Prepare the post body for the new Posts API
  const postBody = {
    author: `urn:li:person:${profile.sub}`,
    commentary: text,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: []
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false
  };

  // Post to LinkedIn using the new Posts API
  const postRes = await fetch(LINKEDIN_POSTS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'LinkedIn-Version': '202306',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(postBody),
  });
  let postResultText = await postRes.text();
  let postResult;
  try {
    postResult = JSON.parse(postResultText);
  } catch {
    postResult = null;
  }
  // Extract post ID from X-RestLi-Id header
  const postIdHeader = postRes.headers.get('x-restli-id');
  let postUrl = null;
  if (postIdHeader) {
    postUrl = `https://www.linkedin.com/feed/update/${postIdHeader}`;
  }
  // Always return the raw LinkedIn response and postUrl for debugging
  return NextResponse.json({
    success: postRes.ok,
    status: postRes.status,
    postResult: postResult || postResultText,
    postResultText,
    postUrl,
    postIdHeader
  });
}
