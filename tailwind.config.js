/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#051A24',
        ink2: '#0D212C',
        mist: '#273C46',
        ice: '#F6FCFF',
        frost: '#E0EBF0',
      },
      fontFamily: {
        neue: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        mondwest: ['PP Mondwest', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        primary:
          '0 1px 2px 0 rgba(5,26,36,0.1), 0 4px 4px 0 rgba(5,26,36,0.09), 0 9px 6px 0 rgba(5,26,36,0.05), 0 17px 7px 0 rgba(5,26,36,0.01), 0 26px 7px 0 rgba(5,26,36,0), inset 0 2px 8px 0 rgba(255,255,255,0.5)',
        secondary: '0 0 0 0.5px rgba(0,0,0,0.05), 0 4px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
