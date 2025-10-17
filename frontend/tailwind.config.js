module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981', // Green
        secondary: '#059669', // Darker green
        background: '#ffffff', // White
        text: '#111827', // Dark gray
        accent: '#f3f4f6', // Light gray
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: []
};
