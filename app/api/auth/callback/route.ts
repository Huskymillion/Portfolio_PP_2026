import { NextResponse } from "next/server";

/**
 * Wraps a postMessage string in an HTML page.
 * The CMS popup runs this, posts the result to window.opener (the CMS tab),
 * then closes itself.
 */
function popupHtml(message: string): NextResponse {
  // JSON.stringify the message so special chars are safely escaped inside the JS string literal.
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Authenticating…</title></head>
<body>
<script>
(function () {
  var msg = ${JSON.stringify(message)};
  function send() {
    if (window.opener) {
      window.opener.postMessage(msg, "*");
      window.close();
    } else {
      // opener not ready yet — retry
      setTimeout(send, 100);
    }
  }
  send();
})();
<\/script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

/**
 * GET /api/auth/callback
 * GitHub redirects here after the user authorises.
 * We exchange the code for an access token and send it back to the CMS via postMessage.
 *
 * Expected message format (Decap CMS protocol):
 *   success → "authorization:github:success:{"token":"…","provider":"github"}"
 *   error   → "authorization:github:error:<reason>"
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return popupHtml(`authorization:github:error:${error ?? "missing_code"}`);
  }

  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return popupHtml("authorization:github:error:server_misconfigured");
  }

  // Exchange code → access_token
  let tokenData: Record<string, string>;
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept:         "application/json",
      },
      body: JSON.stringify({
        client_id:     clientId,
        client_secret: clientSecret,
        code,
        redirect_uri:  `${origin}/api/auth/callback`,
      }),
    });
    tokenData = await res.json() as Record<string, string>;
  } catch {
    return popupHtml("authorization:github:error:token_request_failed");
  }

  if (tokenData.error || !tokenData.access_token) {
    const reason = tokenData.error_description ?? tokenData.error ?? "token_exchange_failed";
    return popupHtml(`authorization:github:error:${reason}`);
  }

  const payload = JSON.stringify({
    token:    tokenData.access_token,
    provider: "github",
  });
  return popupHtml(`authorization:github:success:${payload}`);
}
