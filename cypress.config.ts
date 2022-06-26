import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "m6njzj",

  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
