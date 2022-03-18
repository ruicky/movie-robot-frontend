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
  webpack:{
    alias:{
      '@': path.join(path.resolve(__dirname, 'src/'))
    }
  }
};
