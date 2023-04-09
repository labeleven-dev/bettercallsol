import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
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
    visualizer(),
  ],
  server: {
    open: true,
  },
  build: {
    sourcemap: true,
  },
  // the polyfill plugins don't seem to work with vite 4.x
  resolve: {
    alias: {
      process: "process/browser",
      assert: "assert/",
      buffer: "buffer",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      // util: "rollup-plugin-node-polyfills/polyfills/util",
    },
  },
});
