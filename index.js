const http = require("http");
const httpProxy = require("http-proxy");
const url = require("url");

// Create a proxy server
const proxy = httpProxy.createProxyServer();

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  // Parse the incoming request URL
  const parsedUrl = url.parse(req.url);

  // Set the target server (replace with your target server's address)
  const target = {
    host: "127.0.0.1",
    port: 80,
  };

  // Log the request details
  console.log(
    `Forwarding request to ${target.host}:${target.port}${parsedUrl.path}`
  );

  // Forward the request to the target server
  proxy.web(req, res, { target }, (err, proxyRes, proxyResBody) => {
    // Handle proxy errors
    if (err) {
      console.error("Proxy Error:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("An error occurred while processing the request.");
      return;
    }

    // Check if the target server returned a 500 error
    if (proxyRes.statusCode === 500) {
      // Replace "xevil" in the response body
      console.log("status code = 500");
      const modifiedBody = proxyResBody.toString().replace(/XEVIL/g, "AHGROUP");

      // Respond with the modified body
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(modifiedBody);
    }
  });
});

// Listen on port 3000 (you can change it to any available port)
const port = 3003;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
