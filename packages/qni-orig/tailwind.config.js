module.exports = {
  purge: {
    enabled: ["production"].includes(process.env.NODE_ENV),
    content: [
      "./**/*.html.erb",
      "./app/helpers/**/*.rb",
      "./app/javascript/**/*.js",
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        9: "2.25rem",
        18: "4.5rem",
        38: "9.5rem",
        68: "17rem",
        84: "21rem",
        108: "27rem",
      },
      fontSize: {
        "xxs": ".5rem",
      },
      borderWidth: {
        "1": "1px",
      },
      strokeWidth: {
        "3": "3",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
