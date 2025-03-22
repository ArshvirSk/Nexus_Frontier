/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#b026ff',
        'neon-green': '#0fff50',
        'neon-red': '#ff2b2b',
        'dark-gray': '#1a1a1a',
        'darker-gray': '#121212',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'sans-serif'],
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'glow': 'glow 2s infinite',
        'pulse': 'pulse 1.5s infinite',
      },
    },
  },
  plugins: [],
}
