import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          green: '#059669',
          darkGreen: '#047857',
          gold: '#D97706',
          slate: '#0F172A',
        },
      },
    },
  },
  plugins: [],
};

export default config;
