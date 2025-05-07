/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%, 100%': { color: '#6b7280' },  // normal gray
          '50%': { color: '#9ca3af' },      // lighter gray (shining effect)
        },
        vibrate: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        shine: 'shine 2s ease-in-out infinite', // 2s cycle for a subtle shine
        vibrate: 'vibrate 0.2s linear infinite',

      },
      
      
    },
  },
  plugins: [],
}

