/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      colors: {
        // Main page background and surface tokens
        medical: {
          bg: "#F8FBFF",       // Main background
          surface: "#FFFFFF",  // Pure white surface
          softblue: "#F4F9FE", // Very Light blue background
          border: "#DCE7F2",   // Standard border
          text: "#16324F",     // Primary text
          "text-muted": "#64748B", // Muted text
        },
        // Brand & Blue Tokens
        brand: {
          50: "#F4F9FE",
          100: "#EAF5FF",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#1677C8",
          600: "#0284C7",
          700: "#0B4A7A",
          800: "#083B63",
          900: "#0B4A7A",
          dark: "#083B63",     // Deep Blue
          navy: "#0B4A7A",     // Primary Medical Blue
          primary: "#0B4A7A",  // Primary Medical Blue
          bright: "#1677C8",   // Bright Clinical Blue
          light: "#EAF5FF",    // Light Blue
          soft: "#F4F9FE",     // Very Light Blue
          DEFAULT: "#0B4A7A",
        },
        // Clinical Orange Tokens
        medorange: {
          light: "#FFF4E3",    // Light Orange
          primary: "#F4A340",  // Clinical Orange
          dark: "#D97706",
          DEFAULT: "#F4A340",
        },
        // Clinical Risk & Disease Red Tokens
        medred: {
          light: "#FFF0F0",    // Light Red
          primary: "#D9534F",  // Clinical Red
          dark: "#B91C1C",
          DEFAULT: "#D9534F",
        },
        // Healthy & Success Green Tokens
        medgreen: {
          light: "#EAF8F1",    // Light Green
          primary: "#249B68",  // Healthy Green
          DEFAULT: "#249B68",
        },
        // Typography Tokens
        medtext: {
          primary: "#16324F",   // Primary Text
          secondary: "#64748B", // Secondary Text
          muted: "#64748B",     // Secondary/Muted Text
        },
        // Compatibility tokens
        dark: {
          DEFAULT: "#F8FBFF",
          card: "#FFFFFF",
          border: "#DCE7F2",
          hover: "#EAF5FF",
          elevated: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
}
