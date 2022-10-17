import { defineConfig } from 'vite'



// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "__APP_VERSION__": JSON.stringify(process.env.npm_package_version)
  },
  plugins: [
    {
      name: 'configure-response-headers',
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('access-control-allow-origin', '*');
          res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
          res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
          next();
        });
      }
    }]
  
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
