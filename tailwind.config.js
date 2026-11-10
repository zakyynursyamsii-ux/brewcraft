/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F1", sand: "#EFE5D6", espresso: "#2B211C", charcoal: "#1C1815",
        copper: "#B87333", gold: "#C9A227", clay: "#8B5E3C",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      keyframes: {
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        rise: { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "none" } },
        slide: { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
      },
      animation: {
        fade: "fade .2s ease-out",
        rise: "rise .3s cubic-bezier(.2,.8,.2,1)",
        slide: "slide .3s cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};
