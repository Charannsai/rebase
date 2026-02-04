const GATEWAY_URL = "https://api.tryezbuild.tech";

export default async function handler(req, res) {
  const pathParts = req.query.path;
  const forwardPath = Array.isArray(pathParts)
    ? pathParts.join("/")
    : pathParts || "";

  const url = `${GATEWAY_URL}/api/p/${forwardPath}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.EASYBUILD_SECRET_KEY || ""}`,
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
}