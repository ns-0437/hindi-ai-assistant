/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563eb',
        'brand-green': '#16a34a',
        'brand-yellow': '#facc15',
        'brand-red': '#dc2626',
        'brand-violet': '#7c3aed',
        'brand-cyan': '#0891b2',
      },
      animation: {
        'breathing': 'breathing 3s ease-in-out infinite',
        'wave': 'wave 1.5s ease-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'typing-dot': 'typing-dot 1.2s infinite ease-in-out',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 35px rgba(37, 99, 235, 0.7)' },
        },
        wave: {
          '0%': { transform: 'scale(0.9)', opacity: '1' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'typing-dot': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1.0)' },
        },
      },
    },
  },
  plugins: [],
}

