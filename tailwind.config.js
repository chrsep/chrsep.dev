module.exports = {
  purge: ["./src/**/*.svelte"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
  dark: true
}
