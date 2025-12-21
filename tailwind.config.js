/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary teal/turquoise (inspired by dapurbusastro)
        primary: {
          50: '#E6F7F6',
          100: '#B3EBE8',
          200: '#80DED9',
          300: '#4DD2CB',
          400: '#26C8BF',
          500: '#03BEB0', // Main primary
          600: '#02A99C',
          700: '#028F84',
          800: '#01756C',
          900: '#015C55',
        },
        // Secondary deep forest green
        secondary: {
          500: '#065D5F',
          600: '#054D4F',
          700: '#043D3F',
        },
        // Accent light teal for backgrounds
        accent: {
          50: '#F0F7F7',
          100: '#EBF2F2',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}