import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    env: {
      APP_URL: 'http://localhost:3000',
    },
    setupNodeEvents(on, config) {
 
    },
  },
});
