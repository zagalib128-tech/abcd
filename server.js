const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Images
app.use("/images", createProxyMiddleware({
    target: "https://images.fotmob.com",
    changeOrigin: true,
    secure: false
}));

// Pub
app.use("/pub", createProxyMiddleware({
    target: "https://pub.fotmob.com",
    changeOrigin: true,
    secure: false
}));

// Main FotMob
app.use("/", createProxyMiddleware({
    target: "https://www.fotmob.com",
    changeOrigin: true,
    ws: true,
    secure: false
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Proxy running on port " + port);
});
