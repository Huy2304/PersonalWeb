
const API_URL = process.env.REACT_APP_API_URL; // CRA
const config = {
  compress: true,
  hot: true,
  allowedHosts: ['localhost'],
  historyApiFallback: true,
  port: 3000,
  proxy: {
    '/api': {
      target: `${API_URL}`,
      changeOrigin: true,
    },
  },
};

module.exports = config;
