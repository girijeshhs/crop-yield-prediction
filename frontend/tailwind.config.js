module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Core Agricultural Colors
        primary: {
          DEFAULT: "#1B4332", // Forest green (dark)
          light: "#2D6A4F",   // Sage green (medium)
          lighter: "#52B788", // Moss green (light)
        },
        accent: {
          clay: "#A0522D",    // Warm clay
          gold: "#E9C46A",    // Harvest gold
          soil: "#6C4E31",    // Rich soil
        },
        mint: "#D8F3DC",      // Mint (pale)
        // Neutrals
        charcoal: "#264653",  // Charcoal (primary text)
        slate: "#6B7280",     // Slate gray (secondary text)
        cloud: "#F8FAFC",     // Cloud (page backgrounds)
        // Legacy colors for backward compatibility
        earth: {
          50: "#f9faf8",
          100: "#f0f4ed",
          200: "#d9e5cc",
          300: "#b8d19a",
          400: "#8fb968",
          500: "#4A7C2C",
          600: "#2D5016",
          700: "#1f3810",
          800: "#16280b",
          900: "#0d1806",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.3)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    }
  },
  plugins: []
};
