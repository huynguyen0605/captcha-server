const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Set the target server (replace with your target server's address)
const target = "http://127.0.0.1:80";

// Create a proxy middleware
const proxyMiddleware = createProxyMiddleware({
  target,
  changeOrigin: true, // Necessary for virtual hosted sites
  ws: true, // Proxy websockets
  logLevel: "debug", // Enable debug logs
  onError: (err, req, res) => {
    console.error("Proxy Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("An error occurred while processing the request.");
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log the status code
    console.log("proxyRes.statusCode", proxyRes.statusCode);

    // Check if the target server returned a 500 error
    if (proxyRes.statusCode === 500) {
      // Replace "XEVIL" in the response body
      console.log("Status code = 500");
      const chunks = [];
      proxyRes.on("data", (chunk) => {
        chunks.push(chunk);
      });
      proxyRes.on("end", () => {
        const modifiedBody = Buffer.concat(chunks)
          .toString()
          .replace(/XEVIL/g, "AHGROUP");
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(modifiedBody);
      });
    }
  },
});

// Use the proxy middleware
app.use("/", proxyMiddleware);

// Start the server on port 3000 (you can change it to any available port)
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
