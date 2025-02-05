import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import generateFile from 'vite-plugin-generate-file';
import { qrcode } from 'vite-plugin-qrcode';

const APP_VERSION = '1.0.0';
const BUILD_TIMESTAMP = new Date().toISOString();

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      generateFile({
        output: 'build-meta.json',
        type: 'json',
        data: {
          version: APP_VERSION,
          buildTime: BUILD_TIMESTAMP,
        },
      }),
      qrcode(),
    ],
    server: {
      host: true,
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});
