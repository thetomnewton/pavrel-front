const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{ts,vue,js}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },

      fontFamily: {
        sans: ['Inter var, Inter, sans-serif', { fontFeatureSettings: '"cv11", "ss01"' }],
      },

      colors: {
        slate: {
          ...colors.slate,
          ...{
            150: '#e9edf6',
          },
        },
        zinc: {
          50: '#f9fafb',
          100: '#f3f4f5',
          200: '#e4e5ea',
          300: '#d3d4da',
          400: '#9ea1af',
          500: '#6c717a',
          600: '#4d525c',
          700: '#3a3f46',
          800: '#232730',
          900: '#13181e',
        },
      },

      boxShadow: {
        '3xl': 'rgb(0 0 0 / 50%) 0px 16px 70px',
      },
    },
  },

  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },

  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@headlessui/tailwindcss')],
}
