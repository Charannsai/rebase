// FUSEPLANE_RUNTIME: vercel
// FUSEPLANE_VERSION: 0.1.6

const GATEWAY_URL = "https://gNUSNjlF.fuseplane.com";

module.exports = async function handler(req, res) {
  // 1. Capture the full incmoing path (e.g., /12345678/users) directly from req.url
  // This works regardless of the file name or location, as long as Vercel rewrites to it.
  const requestPath = req.url.startsWith("/") ? req.url : `/${req.url}`;

  // 2. Construct the full destination URL
  // Result: https://gNUSNjlF.fuseplane.com/12345678/users
  const url = `${GATEWAY_URL}${requestPath}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        // Ensure this environment variable is set in your Vercel Project Settings
        "Authorization": `Bearer ${process.env.FUSEPLANE_SECRET_KEY || ""}`,
      },
      // Forward the body for non-GET/HEAD requests
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Fuseplane proxy error:", error);
    res.status(500).json({ error: "Proxy failed" });
  }
};