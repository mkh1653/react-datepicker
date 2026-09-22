import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({
      insertTypesEntry: true,
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ReactDatePicker",
      formats: ["es"],
      fileName: "index",
      cssFileName: "style",
    },

    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
