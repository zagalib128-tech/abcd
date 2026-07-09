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
    ws: true,
    xfwd: true,

    pathRewrite: {
        "^/images": ""
    },

    onProxyReq(proxyReq) {
        proxyReq.setHeader("Host", "images.fotmob.com");
        proxyReq.setHeader(
            "Referer",
            "https://www.fotmob.com/"
        );
        proxyReq.setHeader(
            "Origin",
            "https://www.fotmob.com"
        );
        proxyReq.setHeader(
            "User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138 Safari/537.36"
        );
        proxyReq.setHeader(
            "Accept",
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        );
    }
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
