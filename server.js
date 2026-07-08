const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", (req, res, next) => {
  const target = req.query.url;

  if (!target) {
    return res.send(`
      <h2>Proxy is running</h2>
      <p>Use it like this:</p>
      <code>/?url=https://www.example.com</code>
    `);
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    ws: true,
    secure: true,
    followRedirects: true,
    xfwd: true,
    cookieDomainRewrite: "",
    onProxyReq(proxyReq) {
      proxyReq.setHeader(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0 Safari/537.36"
      );
    }
  })(req, res, next);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
