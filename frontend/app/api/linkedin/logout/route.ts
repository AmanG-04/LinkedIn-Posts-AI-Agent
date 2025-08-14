import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Delete the LinkedIn access token cookie
  response.cookies.delete('linkedin_access_token');
  
  return response;
}
