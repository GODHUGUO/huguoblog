import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
    vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxthub/core',
   
  ],
   hub: {
    db: 'sqlite',  
    blob: true,    
    kv: true,     
  },
})