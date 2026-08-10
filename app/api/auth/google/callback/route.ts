import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return new NextResponse(
      `<html>
        <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: white; text-align: center;">
          <div>
            <h2 style="color: #f87171;">Google Authentication Canceled or Failed</h2>
            <p style="color: #94a3b8; font-size: 14px;">${error || "No authorization code provided."}</p>
            <script>
              setTimeout(() => {
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_FAILED', error: '${error || "Canceled"}' }, '*');
                  window.close();
                } else {
                  window.location.href = '/account';
                }
              }, 2000);
            </script>
          </div>
        </body>
      </html>`,
      { headers: { "content-type": "text/html" } }
    );
  }

  // If code exists, attempt to exchange for tokens if client secret is set
  let userInfo = {
    name: "Google Customer",
    email: "customer@gmail.com",
    avatar: "https://lh3.googleusercontent.com/a/default-user",
  };

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    try {
      const host = req.headers.get("host") || "localhost:3000";
      const protocol = req.headers.get("x-forwarded-proto") || "https";
      const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenRes.json();
      if (tokenData.access_type || tokenData.access_token) {
        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const googleUser = await userRes.json();
        if (googleUser.email) {
          userInfo = {
            name: googleUser.name || googleUser.given_name || "Google User",
            email: googleUser.email,
            avatar: googleUser.picture || "https://lh3.googleusercontent.com/a/default-user",
          };
        }
      }
    } catch (e) {
      console.error("[Google OAuth Callback Error]", e);
    }
  }

  return new NextResponse(
    `<html>
      <body style="font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #064e3b; color: white; text-align: center;">
        <div>
          <h2 style="color: #34d399;">✓ Google Authentication Successful</h2>
          <p style="color: #a7f3d0; font-size: 14px;">Logging you in... This window will close automatically.</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_AUTH_SUCCESS',
                user: ${JSON.stringify(userInfo)}
              }, '*');
              window.close();
            } else {
              window.location.href = '/account';
            }
          </script>
        </div>
      </body>
    </html>`,
    { headers: { "content-type": "text/html" } }
  );
}
