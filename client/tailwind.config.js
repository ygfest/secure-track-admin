/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'light-gray': '#f2f5f8',
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#5CC90C",  // green grey from your logo
        "secondary": "#3B3F3F",  // grey
        "accent": "#FFD900",  
        "neutral": "5CC90C",  // Neutral dark color
        "base-100": "#ffffff",  // Base white background
      },
    }],
  },
}
