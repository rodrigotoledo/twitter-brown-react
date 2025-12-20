/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          editor: '#1e1e1e',
          input: '#3c3c3c',
          hover: '#2a2d2e',
          border: '#454545',
          text: '#cccccc',
          'text-muted': '#858585',
          accent: '#007acc',
          'accent-hover': '#005a9e',
        },
      },
    },
  },
  plugins: [],
}
