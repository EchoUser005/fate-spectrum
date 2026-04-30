import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12151f",
        mist: "#f6f7fb",
        prism: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          green: "#22c55e",
          amber: "#f59e0b",
          rose: "#f43f5e"
        }
      },
      boxShadow: {
        spectrum: "0 24px 80px rgba(18, 21, 31, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
