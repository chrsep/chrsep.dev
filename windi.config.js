export default {
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: `InterVariable, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
      },
      textColor: {
        default: {
          700: "#bbbbbb",
          800: "#d0d0d0",
          900: "#fff",
        },
      },
      backgroundColor: {
        default: {
          800: "#1e1e1e",
          900: "#181818",
        },
      },
      gradientColorStops: {
        default: {
          800: "#1e1e1e",
          900: "#181818",
        },
      },
      ringOffsetColor: {
        default: {
          800: "#1e1e1e",
          900: "#181818",
        },
      },
    },
  },
  plugins: [require("windicss/plugin/aspect-ratio")],
}
