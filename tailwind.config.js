/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3F4A3C',
          50: '#f6f7f6',
          100: '#e3e5e2',
          200: '#c6cbc4',
          300: '#a2aa9f',
          400: '#7d877a',
          500: '#636c60',
          600: '#4e564b',
          700: '#3F4A3C',
          800: '#363f34',
          900: '#2e352c',
        },
        secondary: {
          DEFAULT: '#C7A17A',
          50: '#faf7f3',
          100: '#f3ebe0',
          200: '#e6d5c0',
          300: '#d5b899',
          400: '#C7A17A',
          500: '#b78a5e',
          600: '#a97650',
          700: '#8c5f44',
          800: '#724e3b',
          900: '#5d4132',
        },
        accent: {
          DEFAULT: '#EDE6D8',
          50: '#fdfcfa',
          100: '#f9f6f0',
          200: '#EDE6D8',
          300: '#e0d4c0',
          400: '#d0bea2',
          500: '#c0a884',
          600: '#af926a',
          700: '#937856',
          800: '#786249',
          900: '#62513d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
