import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html';
import { HbConfig } from "./src/domain/HbConfig";

const harborTheme = HbConfig.current.harborTheme;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "__APP_VERSION__": JSON.stringify(process.env.npm_package_version),
    "__HARBOR_THEME__":  JSON.stringify(harborTheme)
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
          "__HARBOR_THEME__": harborTheme
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
