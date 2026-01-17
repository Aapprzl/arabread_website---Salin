/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./{assets,assets_gudang,media,icons}/**/*.{html,js}",
  ],
  safelist: [
    // Safelist penting untuk kelas dinamis (JS)
    {
      pattern:
        /(bg|text|border)-(red|green|blue|emerald|slate|amber|cyan|indigo)-(50|100|200|300|400|500|600|700|800|900|950)/,
      variants: ["hover", "focus", "active", "dark"],
    },
    // Safelist specific custom colors/fonts if dynamically called
    "font-arab",
    "font-arabic",
    "bg-primary-500",
    "text-primary-600",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Copied from dashboard-siswa.html script config
        blue: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        indigo: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        // Restore Emerald -> Teal (matches vocabulary.html original look)
        emerald: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        cyan: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#06b6d4",
          600: "#0891b2",
        },
        // Removed Amber override to restore standard Orange/Yellow
        // amber: { ... },

        // From dashboard-guru.html / index.html
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        secondary: { 100: "#dcfce7", 500: "#22c55e", 600: "#16a34a" },
        // From grammar-basics.html
        paper: "#fffdf5",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        arabic: ['"Amiri"', "serif"],
        arab: ['"Amiri"', "serif"],
      },
    },
  },
  plugins: [],
};
