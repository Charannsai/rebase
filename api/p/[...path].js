// FUSEPLANE_RUNTIME: vercel
// FUSEPLANE_VERSION: 0.1.6

const GATEWAY_URL = "https://gNUSNjlF.fuseplane.com";

module.exports = async function handler(req, res) {
  // Use req.url directly to support any route structure. 
  // This works even if you move away from /api/p or use vercel.json rewrites.
  
  // Remove leading slash to ensure clean concatenation with GATEWAY_URL
  const forwardPath = req.url.startsWith("/") ? req.url.slice(1) : req.url;

  // This will now correctly include query parameters (e.g., ?limit=10) automatically
  const url = `${GATEWAY_URL}/${forwardPath}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.FUSEPLANE_SECRET_KEY || ""}`,
      },
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