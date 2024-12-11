/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      './pages/**/*.{js,ts,jsx,tsx}', // Include all files in `pages` directory
      './components/**/*.{js,ts,jsx,tsx}', // Include all files in `components` directory
  ],
  theme: {
      extend: {
          colors: {
              primary: '#1D4ED8', // Custom primary color (blue)
              secondary: '#9333EA', // Custom secondary color (purple)
              success: '#22C55E', // Green for success
              error: '#EF4444', // Red for errors
              warning: '#F59E0B', // Yellow for warnings
          },
          fontFamily: {
              sans: ['Inter', 'sans-serif'], // Use Inter as the default sans font
          },
          spacing: {
              18: '4.5rem', // Custom spacing example
          },
          borderRadius: {
              '4xl': '2rem', // Extra large radius
          },
      },
  },
  plugins: [],
};
