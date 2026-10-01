import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import Fonts from "unplugin-fonts/vite";
import { defineConfig, loadEnv } from "vite";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      tailwindcss(),
      Vue({
        template: { transformAssetUrls },
      }),
      // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
      Vuetify({
        autoImport: true,
        styles: {
          configFile: "src/styles/settings.scss",
        },
      }),
      Fonts({
        fontsource: {
          families: [
            {
              name: "Roboto Mono",
              weights: [400, 700],
            },
            {
              name: "Roboto",
              weights: [100, 300, 400, 500, 700, 900],
              styles: ["normal", "italic"],
            },
          ],
        },
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("src", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
      allowedHosts: ["fleetviews.mobileinnovation.asia"],
      port: Number(env.PORT) || 6000,
      proxy: {
        // Proxy /vss requests to the remote API to avoid CORS in dev
        "/vss": {
          target: "https://superhero.mobileinnovation.asia",
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            // Remove headers that block framing when running the dev server.
            proxy.on("proxyRes", (proxyRes) => {
              try {
                delete proxyRes.headers["x-frame-options"];
                delete proxyRes.headers["content-security-policy"];
                delete proxyRes.headers["x-content-type-options"];
              } catch (e) {
                // ignore
              }
            });
          },
          rewrite: (path) => path.replace(/^\/vss/, "/vss"),
        },
      },
    },
  };
});
