const { createProxyMiddleware } = require('http-proxy-middleware');

const apiUrl = 'https://dev.cov19.vc'; //Change it to your local backend project

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      logLevel: "debug"
    })
  );
};
