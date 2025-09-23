/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0A0A0A',
        'luxury-dark': '#121212',
        'luxury-gray': '#1E1E1E',
        'luxury-charcoal': '#2A2A2A',
        'luxury-gold': '#D4AF37',
        'luxury-gold-light': '#FFD700',
        'luxury-gold-dark': '#996515',
        'luxury-text': '#FFFFFF',
        'luxury-text-secondary': '#CCCCCC',
        'luxury-text-muted': '#999999',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(to right, #121212, #1E1E1E, #121212)',
        'gradient-gold': 'linear-gradient(to right, #996515, #D4AF37, #996515)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(212, 175, 55, 0.5)',
        'gold-sm': '0 0 5px rgba(212, 175, 55, 0.5)',
        'inner-gold': 'inset 0 0 5px rgba(212, 175, 55, 0.5)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(to right, #121212, #1E1E1E, #121212)',
        'gradient-gold': 'linear-gradient(to right, #996515, #D4AF37, #996515)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(212, 175, 55, 0.5)',
        'gold-sm': '0 0 5px rgba(212, 175, 55, 0.5)',
        'inner-gold': 'inset 0 0 5px rgba(212, 175, 55, 0.5)',
      },
      borderColor: {
        'gold-fade': 'rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}