import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f1f9ff",
          100: "#d8eeff",
          200: "#b5deff",
          500: "#1f8cff",
          700: "#0f5fc4"
        }
      }
    }
  },
  plugins: []
};

export default config;
