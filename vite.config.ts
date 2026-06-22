import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  
  // Expose env vars as defines
  const envDefine = Object.entries(env).reduce((acc, [key, val]) => {
    acc[`import.meta.env.${key}`] = JSON.stringify(val);
    return acc;
  }, {} as Record<string, string>);

  return {
    define: envDefine,
    plugins: [
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      react(),
    ],
    resolve: {
      alias: {
        "@": `${process.cwd()}/src`,
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    css: {
      transformer: "lightningcss",
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime"
      ],
      ignoreOutdatedRequests: true
    },
    server: {
      host: "::",
      port: 8080,
    }
  };
});

