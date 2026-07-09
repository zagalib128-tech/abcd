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
  }
}));

// Pub
app.use("/pub", createProxyMiddleware({
  target: "https://pub.fotmob.com",
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    "^/pub": ""
  }
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

  onProxyRes: responseInterceptor(async (buffer, proxyRes) => {

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

            if (img.srcset) {
                img.srcset = img.srcset.replace(
                    /https:\\/\\/images\\.fotmob\\.com/g,
                    "/images"
                );
            }

        });

        document.querySelectorAll("*").forEach(el => {

            const bg = getComputedStyle(el).backgroundImage;

            if (bg && bg.includes("https://images.fotmob.com")) {
                el.style.backgroundImage = bg.replace(
                    /https:\\/\\/images\\.fotmob\\.com/g,
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
        attributeFilter:["src","srcset","style"]
    });

})();
</script>
`;

      body = body.replace("</head>", inject + "</head>");

      return body;
    }

    return buffer;
  }),
}));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Proxy running on port " + port);
});
