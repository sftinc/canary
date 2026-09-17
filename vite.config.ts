import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Set DEPLOY_SHA in the build environment to stamp the page with the deployed
// commit. Building by hand has no sha, and saying so beats baking in a lie.
const deploySha = process.env.DEPLOY_SHA ?? ''

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    __DEPLOY_SHA__: JSON.stringify(deploySha),
    __BUILT_AT__: JSON.stringify(new Date().toISOString()),
  },
})
