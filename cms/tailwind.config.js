/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'utalca-red': '#C41E3A',
        'dm-bg': '#0a0a0a',
        'dm-surface': '#141414',
        'dm-surface2': '#1e1e1e',
        'dm-border': '#2a2a2a',
        'dm-text': '#ffffff',
        'dm-muted': '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

