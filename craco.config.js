const CracoAlias = require("craco-alias");
const path = require('path');
module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "options",
        baseUrl: "./",
        aliases: {
          "@mui/styled-engine": "./node_modules/@mui/styled-engine-sc",
        },
      },
    },
  ],
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    return process.env.REACT_APP_DEV_PROXY ? {
      ...devServerConfig,
      proxy: {
        '/api': {
          target: process.env.REACT_APP_DEV_PROXY || '',
          secure: false,
          changeOrigin: true,
        }
      }
    } : devServerConfig;
  },
  webpack: {
    alias: {
      '@': path.join(path.resolve(__dirname, 'src/'))
    }
  }
};
