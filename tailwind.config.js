/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green:   '#146252',
          dark:    '#043D31',
          bg:      '#F1F6F5',
          heading: '#444444',
          body:    '#7A7A7A',
          text:    '#181818',
          border:  '#DDE8E5',
          icon:    '#E8F3F0',
        },
      },
      fontFamily: {
        // "Pepi Trail" falls back to Maven Pro until the custom font file is added
        display: ['"Pepi Trail"', '"Maven Pro"', 'sans-serif'],
        heading: ['"Maven Pro"', 'sans-serif'],
        body:    ['"Maven Pro"', 'sans-serif'],
        nav:     ['"Poppins"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
