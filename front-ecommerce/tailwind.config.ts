import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'soft-primary': '#84D187',
        primary: '#00B207',
        'hard-primary': '#2C742F',
        warning: '#FF8A00',
        danger: '#EA4B48',
        white: '#FFFFFF',
        gray: {
          '9': '#2A2A2A',
          '8': '#3A3A3A',
          '7': '#4A4A4A',
          '6': '#5A5A5A',
          '5': '#6A6A6A',
          '4': '#8A8A8A',
          '3': '#A9A9A9',
          '2': '#C7C7C7',
          '1': '#E5E5E5',
          '0.5': '#F3F3F3',
        },
        'green-gray': {
          '9': '#1B2A1B',
          '8': '#2C3A2C',
          '7': '#3C4A3C',
          '6': '#4C5A4C',
          '5': '#5C6A5C',
          '4': '#7A887A',
          '3': '#98A598',
          '2': '#B5C0B5',
          '1': '#D2D9D2',
          '0.5': '#E9ECE9',
        },
      },
    },
  },
  plugins: [],
};
export default config;
