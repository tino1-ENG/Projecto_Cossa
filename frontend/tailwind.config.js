/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Palette per Specification
        'canvas': '#F4F1EB',
        'surface': '#FFFFFF',
        'surface-card': '#FFFFFF',
        'surface-subtle': '#FAF8F5',
        'surface-muted': '#EFECE5',
        'surface-dark': '#171717',
        'surface-dark-card': '#212121',
        
        // Brand & Accents
        'primary': '#B69A68',
        'primary-dark': '#967B48',
        'primary-light': '#D6C4A3',
        'primary-subtle': '#F8F4EC',
        'accent': '#B69A68',

        // Text & Hierarchy
        'text-primary': '#171717',
        'text-secondary': '#777777',
        'text-muted': '#999999',
        
        // Structural Borders
        'border-subtle': '#E7E3DC',
        'border-strong': '#D3CCBF',

        // Legacy token mappings for backwards compatibility
        'on-surface': '#171717',
        'on-surface-variant': '#777777',
        'surface-container': '#FFFFFF',
        'surface-container-low': '#FAF8F5',
        'surface-container-lowest': '#F4F1EB',
        'surface-container-high': '#EFECE5',
        'surface-container-highest': '#E7E3DC',
        'secondary': '#171717',
        'error': '#991B1B',
        'positive': '#166534'
      },
      fontFamily: {
        'editorial': ['Playfair Display', 'Georgia', 'serif'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'Manrope', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card': '0 2px 8px rgba(23,23,23,0.04), 0 1px 2px rgba(23,23,23,0.02)',
        'card-hover': '0 12px 24px -6px rgba(23,23,23,0.08), 0 4px 12px -2px rgba(23,23,23,0.04)',
        'elevated': '0 20px 40px -12px rgba(23,23,23,0.12)',
      }
    },
  },
  plugins: [],
}
