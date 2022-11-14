import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr';
import fs from 'fs/promises';
import { resolve } from 'path'


export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, 'src') },
        {
          find: /^@mui\/icons-material\/(.*)/,
          replacement: "@mui/icons-material/esm/$1"
        },
        {
          find: '@mui/styled-engine',
          replacement: '@mui/styled-engine-sc'
        },
      ],
    },
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
        plugins: [
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8"),
              }));
            },
          },
        ],
      },
    },
    plugins: [react({
      babel: {
        plugins: ['babel-plugin-macros']
      }
    }), svgrPlugin()],
    server: {
      open: true,
      port: 3000,
      proxy: {
        '^(/api/|/user/).*': {
          target: env.VITE_DEV_PROXY || '',
          secure: false,
          changeOrigin: true,
        },
        '^/plugins/.*/logo.jpg': {
          target: env.VITE_DEV_PROXY || '',
          secure: false,
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'build',
    },
  }
})