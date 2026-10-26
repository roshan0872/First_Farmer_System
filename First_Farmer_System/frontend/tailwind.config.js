/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F5135',
          dark: '#14532D',
          light: '#2E7D4F',
        },
        sage: {
          DEFAULT: '#6E9F78',
          light: '#EEF5EE',
        },
        agri: {
          page: '#F7F9F5',
          surface: '#FFFFFF',
          text: '#1F2933',
          muted: '#59665D',
          border: '#DCE5DC',
          success: '#247447',
          warning: '#A86412',
          error: '#B42318',
          focus: '#14532D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
