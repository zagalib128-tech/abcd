const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxyServer({});

http.createServer(function (req, res) {
  proxy.web(req, res, { target: req.url });
}).listen(process.env.PORT || 3000);