import type { Config } from "tailwindcss";

import baseConfig from "@/tailwind-config/native";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [baseConfig],
} satisfies Config;
