/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'true-gray': "#171717",
        'true-gray-600' : "#52525B",
        'true-green-600' : "#059669",
        'color-42' : "#1fbabc",
        'color-kakao' : "#fce403"
      },
      fontFamily: {
        pixel: ['PressStart2P', 'sans'],
      },
    },
  },
  plugins: [],
};
