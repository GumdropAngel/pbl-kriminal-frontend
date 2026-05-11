import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Next.js next/font injects CSS variables on <html>
        // These map to the variables set in layout.tsx
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink:   '#0a0a0a',
        alert: '#cc0000',
      },
    },
  },
  plugins: [],
}

export default config
