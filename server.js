const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Add headers to bypass FotMob blocking
app.use((req, res, next) => {
  req.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  req.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
  req.headers['Accept-Language'] = 'en-US,en;q=0.9';
  req.headers['Referer'] = 'https://www.fotmob.com/';
  req.headers['Origin'] = 'https://www.fotmob.com/';
  next();
});

app.use("/", createProxyMiddleware({
    target: "https://www.fotmob.com",
    changeOrigin: true,
    ws: true,
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Host', 'www.fotmob.com');
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Proxy running on port " + port);
});