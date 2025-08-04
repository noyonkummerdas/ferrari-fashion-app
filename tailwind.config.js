/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#fdb714",
        secondary: {
          DEFAULT: "#fdb714",
          100: "#fc5f5f",
          200: "#fc7979",
        },
        accent: {
          DEFAULT: "#FF6A39",
          100: "#fc5f5f",
          200: "#fc7979",
        },
        black: {
          DEFAULT: "#000",
          100: "#797979",
          200: "#242424",
        },
        gray: {
          100: "#CDCDE0",
          200:"#F6F6F6"
        },
        w:{
          100: "#F2F2F2",
          
        }
      },
      fontFamily: {
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pbolditalic: ["Poppins-BoldItalic", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
      },
    },
  },
  plugins: [],
}