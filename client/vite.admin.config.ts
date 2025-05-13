import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        admin: path.resolve(__dirname, "admin.html"),
      },
    },
    outDir: "dist-admin",
  },
});
