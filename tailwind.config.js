export default {
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: `InterVariable, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`,
      },
      textColor: {
        default: {
          600: "#737373",
          700: "#bbbbbb",
          800: "#d0d0d0",
          900: "#fff",
        },
      },
      backgroundColor: {
        default: {
          500: "#444444",
          600: "#343434",
          700: "#282828",
          800: "#1e1e1e",
          900: "#181818",
        },
      },
      borderColor: {
        "bg-default": {
          700: "#282828",
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

      typography: {
        DEFAULT: {
          css: {
            color: "white",
            h1: {
              fontWeight: "900",
              color: "#fff",
            },
            h2: {
              fontWeight: "900",
              color: "#fff",
            },
            h3: {
              fontWeight: "700",
              color: "#fff",
            },
            h4: {
              color: "#d0d0d0",
            },
            h5: {
              color: "#d0d0d0",
            },
            h6: {
              color: "#d0d0d0",
            },
            p: {
              color: "#bbbbbb",
            },
            a: {
              color: "#bbbbbb",
            },
            li: {
              color: "#bbbbbb",
            },
          },
        },
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
      },
    },
  },
  plugins: [
    require("windicss/plugin/aspect-ratio"),
    require("windicss/plugin/typography"),
    require("windicss/plugin/scroll-snap"),
  ],
}
