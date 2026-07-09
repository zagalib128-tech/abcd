const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
    target: "https://www.fotmob.com",
    changeOrigin: true,
    ws: true,
    secure: false,
    xfwd: true,
    followRedirects: true,
    onProxyReq(proxyReq) {
        proxyReq.setHeader("User-Agent", "Mozilla/5.0");
        proxyReq.setHeader("Accept", "*/*");
        proxyReq.setHeader("Accept-Language", "en-US,en;q=0.9");
    }
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Proxy running on port " + port);
});


