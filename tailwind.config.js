/** @type {import('tailwindcss').Config} */
// https://mui.com/material-ui/guides/interoperability/#tailwind-css
module.exports = {
  // Remove Tailwind CSS's preflight style so it can use the Material UI's preflight instead (CssBaseline).
  corePlugins: {
    preflight: false,
  },
  important: "#root",
  prefix: "tw-",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
