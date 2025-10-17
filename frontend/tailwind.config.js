module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Modern Tech Color Palette
        primary: {
          DEFAULT: "#1e293b", // Slate-800 (deep navy)
          light: "#334155",   // Slate-700 (medium navy)
          lighter: "#475569", // Slate-600 (light navy)
          dark: "#0f172a",    // Slate-900 (darker navy)
        },
        secondary: {
          DEFAULT: "#7c3aed", // Violet-600 (premium purple)
          light: "#8b5cf6",   // Violet-500 (lighter purple)
          lighter: "#a78bfa", // Violet-400 (light purple)
          dark: "#6d28d9",    // Violet-700 (darker purple)
        },
        accent: {
          DEFAULT: "#06b6d4", // Cyan-500 (bright accent)
          light: "#22d3ee",   // Cyan-400 (lighter cyan)
          dark: "#0891b2",    // Cyan-600 (darker cyan)
        },
        success: {
          DEFAULT: "#10b981", // Emerald-500
          light: "#34d399",   // Emerald-400
          dark: "#059669",    // Emerald-600
        },
        warning: {
          DEFAULT: "#f59e0b", // Amber-500
          light: "#fbbf24",   // Amber-400
          dark: "#d97706",    // Amber-600
        },
        danger: {
          DEFAULT: "#ef4444", // Red-500
          light: "#f87171",   // Red-400
          dark: "#dc2626",    // Red-600
        },
        // Neutral grays
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Background colors
        background: {
          primary: "#ffffff",
          secondary: "#f8fafc",
          tertiary: "#f1f5f9",
        },
        // Legacy support (will be phased out)
        mint: "#f0f9ff",      // Light blue instead of mint
        charcoal: "#1e293b",  // Slate-800
        slate: "#64748b",     // Slate-500
        cloud: "#f8fafc",     // Gray-50
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Nunito', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
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
