import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  publicDir: "public",
  build: {
    outDir: "dist-admin",
    rollupOptions: {
      input: {
        admin: path.resolve(__dirname, "admin.html"),
      },
    },
  },
});
