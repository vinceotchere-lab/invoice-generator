import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// A relative base means the built files work no matter what subpath
// GitHub Pages serves them from — no need to know the repo name in advance.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
