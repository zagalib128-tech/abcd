const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use("/", createProxyMiddleware({
  target: "https://www.fotmob.com",
  changeOrigin: true,
  ws: true,
  secure: false,
  logLevel: "debug",
  onError(err, req, res) {
    console.error(err);
    res.status(502).send("Proxy error");
  }
}));

const port = process.env.PORT || 3000;
app.listen(port);
