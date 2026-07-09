const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://www.fotmob.com",
  changeOrigin: true,
  ws: true,
  secure: true,
  followRedirects: true,
  xfwd: true,
  onProxyReq: (proxyReq) => {
    proxyReq.setHeader(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36"
    );
    proxyReq.setHeader("Accept-Language", "en-US,en;q=0.9");
  }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Proxy running on port " + port);
});
