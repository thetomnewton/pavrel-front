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
