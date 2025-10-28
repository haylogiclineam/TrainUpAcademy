import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})

// vite.config.js
// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import { viteStaticCopy } from 'vite-plugin-static-copy'
//
// export default defineConfig({
//   plugins: [
//     vue(),
//     viteStaticCopy({
//       targets: [
//         {
//           src: 'src/locales/*',
//           dest: 'locales'
//         }
//       ]
//     })
//   ]
// })

