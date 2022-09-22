/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      primary: "#000000",
      secondary: "#CACACA",
      tertiary: "#F5F5F5",
      highlight_primary: "#00E0D3",
      background: "#FFFFFF",
      text_primary: "#000000",
      text_secondary: "#8E8E8E",
      error: "#FF0000",
    },
  },
  plugins: [],
};
