// api/p/[...path].js

export default async function handler(req, res) {
  try {
    const rawPath = req.query["...path"];

    if (!rawPath) {
      return res.status(400).json({ error: "Missing path" });
    }

    const parts = Array.isArray(rawPath) ? rawPath : [rawPath];

    // First segment is slug
    const slug = parts[0];

    if (!slug) {
      return res.status(400).json({ error: "Missing project slug" });
    }

    // Everything after slug is forwarded endpoint
    const forwardPath = parts.slice(1).join("/");

    const targetUrl = `https://api.tryezbuild.tech/api/p/${slug}/${forwardPath}`;

    console.log("Forwarding:", req.method, targetUrl);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        "Authorization": `Bearer ${process.env.EASYBUILD_SECRET_KEY || ""}`,
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const text = await response.text();

    res.status(response.status);

    // Forward response headers safely
    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.send(text);

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Gateway failed" });
  }
}
