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
        fs: {
          bg: "#f4f8f5",
          surface: "#fbfaf4",
          "surface-2": "#fffdf8",
          ink: "#14211f",
          muted: "#6f7e77",
          line: "#dce8de",
          gold: "#b58a35",
          blue: "#315f8f",
          cyan: "#1f8f8a",
          green: "#4f8f63",
          rose: "#c45b73",
          slate: "#51615c"
        },
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
