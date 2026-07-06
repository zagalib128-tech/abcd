// Add this to your server.js
app.use((req, res, next) => {
  req.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
  req.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
  req.headers['Referer'] = 'https://www.fotmob.com/';
  next();
});

// Try proxying to multiple FotMob endpoints
const proxyTargets = [
  'https://www.fotmob.com',
  'https://api.fotmob.com',
  'https://cdn.fotmob.com'
];

// Or use dynamic routing
app.use("/", createProxyMiddleware({
    target: "https://www.fotmob.com",
    changeOrigin: true,
    ws: true,
    secure: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('Host', 'www.fotmob.com');
      proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    }
}));