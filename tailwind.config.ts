import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#00453d',
          primaryDark: '#00352f',
          primaryLight: '#0b6b60',
          accent: '#ffa02c',
          accentDark: '#d98213',
          accentLight: '#ffc06f',
          background: '#fbf5dd',
          surface: '#ffffff',
          surfaceSoft: '#fffaf0',
          text: '#10201d',
          muted: '#6b766f',
          border: '#d9d2b8',
          success: '#16875a',
          warning: '#ffa02c',
          danger: '#dc2626',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
