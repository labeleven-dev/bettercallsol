import react from "@vitejs/plugin-react";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    splitVendorChunkPlugin(),
  ],
  server: {
    open: true,
  },
  // the polyfill plugins don't seem to work with vite 4.x
  resolve: {
    alias: {
      process: "process/browser",
      assert: "assert/",
      buffer: "buffer",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
  },
});
