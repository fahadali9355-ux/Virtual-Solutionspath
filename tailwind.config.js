/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vsp: {
          50: '#F0F9FF', 
          100: '#E0F2FE',
          500: '#0EA5E9', 
          600: '#0284C7', 
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E', 
          950: '#082F49', 
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right bottom, #F0F9FF, #E0F2FE, #ffffff)',
        'blue-gradient': 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)', 
      },
      boxShadow: {
        'glow': '0 0 20px rgba(14, 165, 233, 0.3)', 
      }
    },
  },
  plugins: [],
};