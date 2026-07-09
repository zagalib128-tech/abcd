const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const harmon = require("harmon");

const app = express();

app.use(harmon([], [{
    query: "html",
    func: function (node) {
        if (!node.createWriteStream) return;

        let html = "";

        const ws = node.createWriteStream();

        ws._write = function (chunk, enc, next) {
            html += chunk.toString();
            next();
        };

        ws.on("finish", () => {
            html = html
                .replace(/https:\/\/images\.fotmob\.com/g, "/images")
                .replace(/https:\/\/pub\.fotmob\.com/g, "/pub");

            node.write(html);
            node.end();
        });
    }
}]));

app.use("/images", createProxyMiddleware({
    target: "https://images.fotmob.com",
    changeOrigin: true,
    secure: false
}));

app.use("/pub", createProxyMiddleware({
    target: "https://pub.fotmob.com",
    changeOrigin: true,
    secure: false
}));

app.use("/", createProxyMiddleware({
    target: "https://www.fotmob.com",
    changeOrigin: true,
    ws: true,
    secure: false,
    selfHandleResponse: false
}));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Proxy running on port " + port);
});
