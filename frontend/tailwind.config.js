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
        'cool-slate': '#64748B', // Base neutral slate
        'cool-slate-dark': '#475569',
        'cool-slate-darker': '#334155',
        'cool-slate-light': '#94A3B8',
        'cool-slate-lighter': '#CBD5E1',
        'cool-indigo': '#6366F1', // Primary accent
        'cool-indigo-dark': '#4F46E5',
        'cool-indigo-light': '#818CF8',
        'cool-teal': '#2DD4BF', // Secondary accent
        'cool-teal-dark': '#14B8A6',
        'cool-teal-light': '#5EEAD4',
        'cool-dark': '#1E293B', // Dark background
        'cool-dark-light': '#334155',
        'cool-light': '#F8FAFC', // Light background
        'cool-light-dark': '#F1F5F9',
        'cool-accent': '#9333EA', // Purple accent
        'cool-accent-light': '#A855F7',
        'cool-text': '#0F172A',
        'cool-text-light': '#475569',
      },
      backgroundImage: {
        'gradient-cool': 'linear-gradient(to right, #6366F1, #818CF8)',
        'gradient-cool-dark': 'linear-gradient(to right, #1E293B, #334155)',
        'gradient-cool-slate': 'linear-gradient(to right, #64748B, #94A3B8)',
        'gradient-cool-teal': 'linear-gradient(to right, #2DD4BF, #5EEAD4)',
        'gradient-cool-accent': 'linear-gradient(to right, #9333EA, #A855F7)',
      },
      boxShadow: {
        'cool': '0 4px 12px -2px rgba(99, 102, 241, 0.3)',
        'cool-sm': '0 2px 8px -4px rgba(99, 102, 241, 0.2)',
        'cool-inner': 'inset 0 2px 4px rgba(99, 102, 241, 0.15)',
        'cool-teal': '0 4px 12px -2px rgba(45, 212, 191, 0.3)',
        'cool-slate': '0 4px 12px -2px rgba(100, 116, 139, 0.25)',
      },
      borderColor: {
        'cool-fade': 'rgba(99, 102, 241, 0.2)',
        'cool-slate-fade': 'rgba(100, 116, 139, 0.2)',
      }
    },
  },
  plugins: [],
}