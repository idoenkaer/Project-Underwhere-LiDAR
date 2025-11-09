
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'green-bright': 'var(--color-green-bright)',
        'green-primary': 'var(--color-green-primary)',
        'green-muted': 'var(--color-green-muted)',
        'green-dark': 'var(--color-green-dark)',
        'text-primary': 'var(--color-text-primary)',
        'text-accent': 'var(--color-text-accent)',
        'error': 'var(--color-error)',
        'warning': 'var(--color-warning)',
        'data-blue': 'var(--color-data-blue)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green-md': '0 0 20px rgba(15, 255, 80, 0.3)',
        'glow-green-sm': '0 0 10px rgba(15, 255, 80, 0.2)',
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
      }
    },
  },
  plugins: [],
}
