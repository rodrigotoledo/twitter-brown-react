/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/dist/**/*.js',
    'node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        cursor: {
          DEFAULT: '#262626',
          light: '#181818',
          dark: '#141414',
          accent: '#81A1C1',
          'accent-hover': '#87A6C4',
          'on-accent': '#191c22',
          foreground: '#E4E4E4EB',
          muted: '#E4E4E48D',
          border: '#E4E4E413',
          focus: '#E4E4E426',
        },
      },
    },
  },
  plugins: [require('flowbite/plugin')],
}
