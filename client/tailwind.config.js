/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        primary: {
          50: '#F8F7F2',
          100: '#F1EFE4',
          200: '#E3DECA',
          300: '#D5CEAD',
          400: '#C3BB91',
          500: '#B0A574', // Main primary color - Olive/Moss
          600: '#96895D',
          700: '#7A704A',
          800: '#5F5639',
          900: '#46402A',
          950: '#2D2A1A',
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          50: '#F7F4F1',
          100: '#EFE9E2',
          200: '#DED3C6',
          300: '#CEBEA9',
          400: '#BAA48A',
          500: '#A68C6E', // Main secondary color - Cedar/Wood
          600: '#8A735A',
          700: '#705D48',
          800: '#554637',
          900: '#403327',
          950: '#2A221A',
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          50: '#F2F8F7',
          100: '#E4F1EF',
          200: '#CAE3DE',
          300: '#ADD5CC',
          400: '#8FC7BA',
          500: '#70B9A8', // Main accent color - Teal/Sage
          600: '#5A9889',
          700: '#487A6E',
          800: '#375D53',
          900: '#27433C',
          950: '#1A2C28',
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif JP', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fadeIn': 'fadeIn 0.3s ease-in',
        'fadeInUp': 'fadeInUp 0.5s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'fadeInLeft': 'fadeInLeft 0.5s ease-out',
        'fadeInRight': 'fadeInRight 0.5s ease-out',
        'slideInUp': 'slideInUp 0.5s ease-out',
        'slideInDown': 'slideInDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow-primary': '0 0 20px rgba(176, 165, 116, 0.5)',
        'glow-secondary': '0 0 20px rgba(166, 140, 110, 0.5)',
        'glow-accent': '0 0 20px rgba(112, 185, 168, 0.5)',
        'card-hover': '0 10px 40px -15px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'grid-white': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(255 255 255 / 0.05)\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")',
        'grid-black': 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\' width=\'32\' height=\'32\' fill=\'none\' stroke=\'rgb(0 0 0 / 0.05)\'%3e%3cpath d=\'M0 .5H31.5V32\'/%3e%3c/svg%3e")',
        'wave-pattern': 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 10 0 L 0 0 0 10\' fill=\'none\' stroke=\'rgba(176, 165, 116, 0.1)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      // Add animation delay utilities
      const animationDelayUtilities = {
        '.animation-delay-100': {
          'animation-delay': '100ms',
        },
        '.animation-delay-200': {
          'animation-delay': '200ms',
        },
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        '.animation-delay-400': {
          'animation-delay': '400ms',
        },
        '.animation-delay-500': {
          'animation-delay': '500ms',
        },
        '.animation-delay-600': {
          'animation-delay': '600ms',
        },
        '.animation-delay-700': {
          'animation-delay': '700ms',
        },
        '.animation-delay-1000': {
          'animation-delay': '1000ms',
        },
        '.animation-delay-2000': {
          'animation-delay': '2000ms',
        },
      };
      
      // Add custom utilities
      const customUtilities = {
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        '.backdrop-blur-xs': {
          'backdrop-filter': 'blur(2px)',
        },
        '.mask-radial-gradient': {
          'mask-image': 'radial-gradient(circle at center, black, transparent 80%)',
        },
        '.clip-text': {
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
        },
      };
      
      addUtilities(animationDelayUtilities, ['responsive']);
      addUtilities(customUtilities, ['responsive']);
    },
  ],
}; 