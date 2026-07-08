const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

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
