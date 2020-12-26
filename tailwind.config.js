module.exports = {
  purge: {
    mode: "all",
    content: ["./src/**/*.svelte"],
  },
  theme: {
    extend: {
      colors: {
        dark: "#24283b",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.900"),
            a: {
              color: theme("colors.blue.700"),
              "&:hover": {
                color: theme("colors.blue.700"),
                textDecoration: "none",
              },
            },
            "h2 a": {
              color: theme("colors.gray.900"),
              textDecoration: "none",
            },
            ".tag a": {
              textDecoration: "none",
            },
          },
        },

        dark: {
          css: {
            color: "white",

            a: {
              color: "white",
              "&:hover": {
                color: "white",
              },
            },

            h1: {
              color: "white",
            },
            h2: {
              color: "white",
            },
            h3: {
              color: "white",
            },
            h4: {
              color: "white",
            },
            h5: {
              color: "white",
            },
            h6: {
              color: "white",
            },

            strong: {
              color: "white",
            },

            code: {
              color: "white",
            },

            figcaption: {
              color: theme("colors.gray.500"),
            },

            "::selection": {
              backgroundColor: "#6f7bb635",
            },
          },
        },
      }),
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: 'media'
}
