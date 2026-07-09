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

    pathRewrite: {
        "^/images": ""
    },

    onProxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {

    const type = proxyRes.headers["content-type"] || "";

    if (type.includes("text/html")) {

        let body = buffer.toString("utf8");

        const inject = `
<script>
(function () {

    function rewrite() {
        document.querySelectorAll("img").forEach(img => {
            if (img.src.startsWith("https://images.fotmob.com")) {
                img.src = img.src.replace(
                    "https://images.fotmob.com",
                    "/images"
                );
            }
        });
    }

    rewrite();

    new MutationObserver(rewrite).observe(document.documentElement,{
        childList:true,
        subtree:true,
        attributes:true,
        attributeFilter:["src"]
    });

})();
</script>
`;

        body = body.replace("</head>", inject + "</head>");

        return body;
    }

    return buffer;
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

    onProxyReq(proxyReq) {
        proxyReq.setHeader("Accept-Encoding", "identity");
    },

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
