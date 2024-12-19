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
      screens: {
        xs: "480px",
        ss: "620px",
        sm: "768px",
        md: "1060px",
        lg: "1200px",
        xl: "1700px",
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite', // Slower spin animation
        'fade-in-up': 'fadeInUp 0.8s ease-in-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#5CC90C",
        //"primary": "#8f00ff",
        "secondary": "#3B3F3F",
        "accent": "#FFD900",
        "neutral": "#5CC90C",
        "base-100": "#ffffff",
      },
    }],
  },
}
