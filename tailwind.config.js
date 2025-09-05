/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 50%)',
        accent: 'hsl(160, 70%, 45%)',
        success: 'hsl(120, 70%, 45%)',
        error: 'hsl(0, 80%, 60%)',
        neutral: {
          100: 'hsl(210, 30%, 95%)',
          500: 'hsl(210, 30%, 40%)',
          900: 'hsl(210, 30%, 10%)',
        },
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 30%, 10%, 0.1)',
        'modal': '0 12px 32px hsla(210, 30%, 10%, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
