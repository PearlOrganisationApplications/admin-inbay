/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* BRAND */
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",

        /* BACKGROUND */
        bgMain: "rgb(var(--bg-main) / <alpha-value>)",
        bgCard: "rgb(var(--bg-card) / <alpha-value>)",
        bgMuted: "rgb(var(--bg-muted) / <alpha-value>)",

        /* TEXT */
        textPrimary: "rgb(var(--text-primary) / <alpha-value>)",
        textSecondary: "rgb(var(--text-secondary) / <alpha-value>)",
        textWhite: "rgb(var(--text-white) / <alpha-value>)",

        /* STATUS */
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        error: "rgb(var(--error) / <alpha-value>)",

        /* SIDEBAR */
        sidebarBg: "rgb(var(--sidebar-bg) / <alpha-value>)",
        sidebarText: "rgb(var(--sidebar-text) / <alpha-value>)",
        sidebarActiveBg: "rgb(var(--sidebar-active-bg) / <alpha-value>)",
        sidebarActiveText:
          "rgb(var(--sidebar-active-text) / <alpha-value>)",
        sidebarHoverBg: "rgb(var(--sidebar-hover-bg))",
        sidebarBorder: "rgb(var(--sidebar-border))",
      },
    },
  },
  plugins: [],
};
