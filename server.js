const express = require("express");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");

const app = express();

// Images
app.use("/images", createProxyMiddleware({
  target: "https://images.fotmob.com",
  changeOrigin: true,
  secure: false,
}));

// Pub
app.use("/pub", createProxyMiddleware({
  target: "https://pub.fotmob.com",
  changeOrigin: true,
  secure: false,
}));

// Main proxy
app.use("/", createProxyMiddleware({
  target: "https://www.fotmob.com",
  changeOrigin: true,
  secure: false,
  ws: true,

  selfHandleResponse: true,

  onProxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {

    const type = proxyRes.headers["content-type"] || "";

    // Only rewrite HTML
    if (type.includes("text/html")) {

      let body = buffer.toString("utf8");

      body = body
        .replace(/https:\/\/images\.fotmob\.com/g, "/images")
        .replace(/https:\/\/pub\.fotmob\.com/g, "/pub");

      return body;
    }

    return buffer;
  }),
}));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Proxy running on port " + port);
});
