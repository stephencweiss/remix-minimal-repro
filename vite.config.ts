import path from "path";

import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { vitePlugin as remix } from "@remix-run/dev";
import esbuild from "esbuild";
import { routeExtensions }  from "remix-custom-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
    https: {
      key: "./server/dev/key.pem",
      cert: "./server/dev/cert.pem",
    },
  },
  plugins: [
    devServer({
      injectClientScript: false,
      entry: "server/index.ts", // The file path of your server.
      exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude],
    }),
    tsconfigPaths(),
    remix({
      serverBuildFile: "remix.js",
      future: {
        v3_fetcherPersist: true,
      },
      routes() {
        // eslint-disable-next-line no-undef
        const appDirectory = path.join(__dirname, "app");
        return routeExtensions(appDirectory);
      },
      buildEnd: async () => {
        await esbuild
          .build({
            // The final file name
            outfile: "build/server/index.js",
            // Our server entry point
            entryPoints: ["server/index.ts"],
            // Dependencies that should not be bundled
            // We import the remix build from "../build/server/remix.js", so no need to bundle it again
            external: ["./build/server/*"],
            platform: "node",
            format: "esm",
            // Don't include node_modules in the bundle
            packages: "external",
            bundle: true,
            logLevel: "info",
          })
          .catch((error: unknown) => {
            console.error(error);
            process.exit(1);
          });
      },
    }),
  ],
});
