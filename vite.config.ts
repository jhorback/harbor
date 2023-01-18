import { defineConfig } from "vite"
import { createHtmlPlugin } from "vite-plugin-html";
import { getHarborConfig } from "./harbor.config";
import * as dotenv from 'dotenv';

dotenv.config();
const harborConfig = getHarborConfig(process.env.npm_package_version, process.env.FB_PROJECT_ID);
console.info("npm_package_version", process.env.npm_package_version);
console.info("FB_PROJECT_ID", process.env.FB_PROJECT_ID);
console.info("Using harborConfig:", harborConfig);


// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "__HARBOR_CONFIG__": JSON.stringify(harborConfig),
  },
  plugins: [{
      name: 'configure-response-headers',
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('access-control-allow-origin', '*');
          res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
          res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
          next();
        });
      }
    }, createHtmlPlugin({
        minify: false,
        inject: {
        data: {
          harborTheme: harborConfig.harborTheme,
          applicationTitle: harborConfig.applicationTitle
        }
      }
    })]
  
  // build: {
  //   lib: {
  //     entry: 'src/my-element.ts',
  //     formats: ['es']
  //   },
  //   rollupOptions: {
  //     external: /^lit/
  //   }
  // }
})
