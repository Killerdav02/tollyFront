import { defineConfig, loadEnv } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.VITE_API_URL || "http://localhost:8080";

  return {
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": backendUrl,
        "/auth": backendUrl,
        "/payments": backendUrl,
        "/categories": backendUrl,
        "/tools": backendUrl,
        "/tool-images": backendUrl,
        "/tool-statuses": backendUrl,
        "/users": backendUrl,
        "/admin": backendUrl,
        "/invoices": backendUrl,
        "/returns": backendUrl,
        "/return-statuses": backendUrl,
      },
    },
  };
});
