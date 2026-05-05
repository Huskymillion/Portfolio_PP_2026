import { NextResponse } from "next/server";

/**
 * Wraps the Decap CMS two-way handshake in an HTML page.
 *
 * Decap CMS 3.x expects:
 *   1. Popup sends  → "authorizing:github"  to opener
 *   2. Opener sends ← any message           back to popup
 *   3. Popup sends  → "authorization:github:success:{token,provider}"  to opener's origin
 *
 * Without step 1, Decap never registers the success message.
 */
function popupHtml(message: string): NextResponse {
  const safeMsg = JSON.stringify(message);
  const html    = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>Authenticating…</title></head>
<body>
<script>
(function () {
  var msg = ${safeMsg};
  function receiveMessage(e) {
    window.opener.postMessage(msg, e.origin || "*");
    window.close();
  }
  window.addEventListener("message", receiveMessage, false);
  // Ping the opener — Decap 3.x listens for this before accepting the token
  if (window.opener) {
    window.opener.postMessage("authorizing:github", "*");
  } else {
    // opener not ready yet — retry
    var t = setInterval(function () {
      if (window.opener) {
        clearInterval(t);
        window.opener.postMessage("authorizing:github", "*");
      }
    }, 100);
  }
})();
<\/script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function errorHtml(reason: string): NextResponse {
  const safeMsg = JSON.stringify(`authorization:github:error:${reason}`);
  const html    = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body>
<script>
(function () {
  var msg = ${safeMsg};
  if (window.opener) { window.opener.postMessage(msg, "*"); }
  window.close();
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
 * We exchange the code → access token, then drive the Decap handshake.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return errorHtml(error ?? "missing_code");
  }

  const clientId     = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return errorHtml("server_misconfigured");
  }

  let tokenData: Record<string, string>;
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method:  "POST",
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
    return errorHtml("token_request_failed");
  }

  if (tokenData.error || !tokenData.access_token) {
    const reason = tokenData.error_description ?? tokenData.error ?? "token_exchange_failed";
    return errorHtml(reason);
  }

  const payload = JSON.stringify({
    token:    tokenData.access_token,
    provider: "github",
  });
  return popupHtml(`authorization:github:success:${payload}`);
}
