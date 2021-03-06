const borderRadius = {
  DEFAULT: "8px",
  xl: "24px",
}
const maxWidth = { DEFAULT: "80rem" }

// const serif = "Lora, Georgia"
//
// const fontFamily = { serif }
// const heading = { fontFamily: serif }
// const typography = {
//   DEFAULT: {
//     css: {
//       h1: heading,
//       h2: heading,
//       h3: heading,
//       h4: heading,
//       h5: heading,
//       h6: heading,
//       strong: heading,
//     },
//   },
// }

const colors = {
  primary: "purple",
  "primary-text": "#992424",
}

module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    // fontFamily,
    extend: {
      // typography,
      borderRadius,
      colors,
      maxWidth,
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
}
