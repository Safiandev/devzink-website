// DevZink website Worker — clean source.
// Reconstructed from the deployed bundle (Cloudflare dashboard, version bf146429).
// The bundle embedded every asset as a hashed import; this source serves the same
// files through the standard [assets] binding (env.ASSETS) instead, so `wrangler deploy`
// and the git-connected Cloudflare build can rebuild it from this repo.
//
// What it does:
//   - Serves the static site (clean URLs, trailing-slash + .html redirects, custom 404)
//   - POST /api/contact  — validates the contact form, stores the lead in KV
//   - POST /api/consent  — stores cookie-consent records in KV
//   - Security headers + CSP on HTML pages, rate limiting via KV counters
//   - No secrets in this file: no API keys. Leads/consent are only stored in KV,
//     no email is sent from here. Safe to keep in a public repo.
//
// Required bindings (see wrangler.toml):
//   - KV namespace  CONSENT  (namespace id goes in wrangler.toml)
//   - Assets binding ASSETS  (directory ./site)
//   - SALT: a dashboard secret/var used only to hash visitor IPs for rate
//     limiting. It is NOT in this repo — keep it as a dashboard Secret.
//     If it is missing, the worker still works (hashes fall back to "undefined").

var ALLOWED = ["https://devzink.com", "https://www.devzink.com"];

var sec = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex"
};

function cors(o) {
  const ok = ALLOWED.includes(o) || /^https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev$/.test(o);
  return { "Access-Control-Allow-Origin": ok ? o : ALLOWED[0], "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", Vary: "Origin" };
}

function json(d, s, h) {
  return new Response(JSON.stringify(d), { status: s, headers: { ...sec, ...h, "Content-Type": "application/json" } });
}

async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function consent(req, env) {
  const o = req.headers.get("Origin") || "", h = cors(o);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ error: "method" }, 405, h);
  if (Number(req.headers.get("Content-Length") || 0) > 2048) return json({ error: "too large" }, 413, h);
  const ip = req.headers.get("CF-Connecting-IP") || "";
  const rk = "rl:" + await sha(ip + env.SALT) + ":" + Math.floor(Date.now() / 60000);
  const n = Number(await env.CONSENT.get(rk) || 0);
  if (n >= 20) return json({ error: "rate limited" }, 429, h);
  await env.CONSENT.put(rk, String(n + 1), { expirationTtl: 120 });
  let b;
  try {
    b = await req.json();
  } catch {
    return json({ error: "bad json" }, 400, h);
  }
  if (!b || typeof b.categories !== "object") return json({ error: "missing categories" }, 400, h);
  const c = b.categories;
  const rec = {
    id: typeof b.id === "string" && /^[a-f0-9-]{36}$/.test(b.id) ? b.id : crypto.randomUUID(),
    action: ["accept_all", "reject_all", "custom"].includes(b.action) ? b.action : "custom",
    categories: { necessary: true, analytics: !!c.analytics, marketing: !!c.marketing },
    version: String(b.version || "1").slice(0, 10),
    page: String(b.page || "").slice(0, 200),
    ipHash: ip ? await sha(ip + env.SALT) : null,
    country: req.cf?.country || null,
    ua: (req.headers.get("User-Agent") || "").slice(0, 200),
    ts: (new Date()).toISOString()
  };
  await env.CONSENT.put(`consent:${rec.ts.slice(0, 10)}:${rec.id}:${Date.now()}`, JSON.stringify(rec));
  return json({ ok: true, id: rec.id }, 200, h);
}

async function contact(req, env) {
  const o = req.headers.get("Origin") || "", h = cors(o);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return json({ error: "method" }, 405, h);
  if (Number(req.headers.get("Content-Length") || 0) > 16384) return json({ error: "too large" }, 413, h);
  const ip = req.headers.get("CF-Connecting-IP") || "";
  const rk = "rlc:" + await sha(ip + env.SALT) + ":" + Math.floor(Date.now() / 600000);
  const n = Number(await env.CONSENT.get(rk) || 0);
  if (n >= 5) return json({ error: "rate limited" }, 429, h);
  await env.CONSENT.put(rk, String(n + 1), { expirationTtl: 900 });
  let b;
  try {
    b = await req.json();
  } catch {
    return json({ error: "bad json" }, 400, h);
  }
  if (!b || b["bot-field"]) return json({ ok: true }, 200, h);
  const s = (k, m) => String(b[k] || "").slice(0, m).trim();
  const lead = {
    name: s("name", 120),
    email: s("email", 200),
    company: s("company", 160),
    service: s("service", 120),
    budget: s("budget", 80),
    message: s("message", 5000),
    country: req.cf?.country || null,
    ipHash: ip ? await sha(ip + env.SALT) : null,
    ts: (new Date()).toISOString()
  };
  if (!lead.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) return json({ error: "invalid" }, 400, h);
  await env.CONSENT.put(`lead:${lead.ts}:${crypto.randomUUID()}`, JSON.stringify(lead));
  return json({ ok: true }, 200, h);
}

var PAGE_HDR = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=(), browsing-topics=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "X-Permitted-Cross-Domain-Policies": "none"
};

var csp_default = "default-src 'self'; script-src 'self' 'unsafe-inline' https://assets.calendly.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://assets.calendly.com; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.web3forms.com https://calendly.com https://*.calendly.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com; frame-src https://calendly.com https://*.calendly.com; form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; upgrade-insecure-requests";

// Same routing/header/cache behaviour as the deployed bundle, but assets come
// from the ASSETS binding (the ./site directory) instead of embedded imports.
async function serveAsset(req, env, u) {
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Method not allowed", { status: 405, headers: { ...PAGE_HDR, Allow: "GET, HEAD" } });
  let p = decodeURIComponent(u.pathname);
  if (p !== "/" && p.endsWith("/")) return Response.redirect(u.origin + p.replace(/\/+$/, "") + u.search, 301);
  if (p.endsWith(".html")) {
    const c = p === "/index.html" ? "/" : p.slice(0, -5);
    if (c !== "/404") return Response.redirect(u.origin + c + u.search, 301);
  }
  let key = p === "/" ? "/index.html" : p;
  // Ask ASSETS without conditional headers; 304 handling is done below.
  let res = await env.ASSETS.fetch(new Request(u.origin + key, { method: "GET" }));
  if (!res.ok && !/\.[a-z0-9]+$/i.test(key)) {
    res = await env.ASSETS.fetch(new Request(u.origin + key + ".html", { method: "GET" }));
  }
  let status = 200;
  if (!res.ok) {
    res = await env.ASSETS.fetch(new Request(u.origin + "/404.html", { method: "GET" }));
    status = 404;
  }
  const type = res.headers.get("Content-Type") || "application/octet-stream";
  const h = { ...PAGE_HDR, "Content-Type": type };
  const etag = res.headers.get("ETag");
  if (etag) h["ETag"] = etag;
  if (type.startsWith("text/html")) {
    h["Content-Security-Policy"] = csp_default;
    h["Cache-Control"] = "public, max-age=0, must-revalidate";
  } else if (/woff2/.test(type)) h["Cache-Control"] = "public, max-age=31536000, immutable";
  else h["Cache-Control"] = "public, max-age=2592000";
  if (status === 200 && etag && req.headers.get("If-None-Match") === etag) return new Response(null, { status: 304, headers: h });
  return new Response(req.method === "HEAD" ? null : res.body, { status, headers: h });
}

export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.hostname === "www.devzink.com") {
      u.hostname = "devzink.com";
      return Response.redirect(u.toString(), 301);
    }
    if (u.pathname === "/api/consent") return consent(req, env);
    if (u.pathname === "/api/contact") return contact(req, env);
    if (u.pathname.startsWith("/api/")) return json({ error: "not found" }, 404, {});
    return serveAsset(req, env, u);
  }
};
