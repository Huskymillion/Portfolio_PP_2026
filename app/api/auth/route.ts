import { NextResponse } from "next/server";

/**
 * GET /api/auth
 * Initiates the GitHub OAuth flow by redirecting to GitHub's authorize page.
 * Decap CMS opens this URL in a popup window.
 */
export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse("GITHUB_CLIENT_ID is not configured", { status: 500 });
  }

  const { origin } = new URL(request.url);

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  `${origin}/api/auth/callback`,
    scope:         "repo",          // "public_repo" is enough for public repos
    response_type: "code",
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );
}
