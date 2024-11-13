import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const serverPort = process.env.PORT || 3000;
console.log(
  `API needs to run on http://localhost:${serverPort} for Vite server`
);
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${serverPort}`,
    },
  },
});
