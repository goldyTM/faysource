import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        page: '#070707',
        panel: '#111111',
        border: '#2a2a2a',
        gold: '#d8b35e',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(0, 0, 0, 0.38)',
      },
    },
  },
  plugins: [],
};

export default config;
