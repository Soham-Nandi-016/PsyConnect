import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        accent: "var(--accent)",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        "glow-primary": "0 0 24px rgba(138, 154, 134, 0.35)",
        "glow-secondary": "0 0 24px rgba(212, 163, 115, 0.35)",
        "glow-soft": "0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        "glass-card": "0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "modal": "0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "mesh-gradient": "radial-gradient(ellipse at 20% 10%, rgba(196,181,253,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(167,243,208,0.28) 0%, transparent 50%), radial-gradient(ellipse at 10% 80%, rgba(254,243,199,0.40) 0%, transparent 55%)",
        "soft-primary": "linear-gradient(135deg, var(--primary) 0%, #6b8f66 100%)",
        "soft-secondary": "linear-gradient(135deg, var(--secondary) 0%, #c8895a 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "4px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
