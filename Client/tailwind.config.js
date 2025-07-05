/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'cursive'],
        bigshoulders: ['"Big Shoulders"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
