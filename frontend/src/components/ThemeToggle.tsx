// src/components/ThemeToggle.tsx
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`
        relative rounded-full p-2 inline-flex items-center justify-center 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-cool-dark
        focus:ring-cool-indigo/50
        transition-all duration-300 transform hover:scale-110 active:scale-95
        ${theme === 'dark' 
          ? 'bg-gradient-to-r from-cool-indigo to-cool-teal text-white hover:shadow-lg hover:shadow-cool-teal/20' 
          : 'bg-cool-slate-lighter hover:bg-cool-slate-light text-cool-slate-darker'
        }
      `}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <div className="relative">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
      ) : (
        <div className="relative">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
      )}
    </button>
  );
}