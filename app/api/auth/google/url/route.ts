import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is missing. Please ensure it is set in the AI Studio Secrets panel.' }, 
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const clientOrigin = url.searchParams.get('origin');
  
  // Use the exact origin from the browser if provided, otherwise fallback to APP_URL
  const appUrl = clientOrigin || process.env.APP_URL || url.origin;
  const cleanAppUrl = appUrl.replace(/\/$/, '');
  const redirectUri = `${cleanAppUrl}/api/auth/google/callback`;

  // Pass the origin in the state parameter so the callback can use the exact same redirect URI
  const state = clientOrigin ? Buffer.from(JSON.stringify({ origin: clientOrigin })).toString('base64') : '';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account consent',
    state: state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
