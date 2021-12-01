export default {
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
      },
      textColor: {
        default: "#fff",
        secondary: "#d0d0d0",
      },
      backgroundColor: {
        default: "#1a1a1a",
      },
    },
  },
  plugins: [],
}
