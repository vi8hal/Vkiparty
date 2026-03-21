/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Brand
        saffron:  { DEFAULT: '#FF6B00', light: '#FF8C38', glow: 'rgba(255,107,0,0.18)' },
        gold:     { DEFAULT: '#FFD700', light: '#FFE44D', dark: '#E5B800' },
        vanda:    { DEFAULT: '#0A0A0F', mid: '#111118', light: '#1A1A28', surface: '#22223A' },
        // Semantic
        success:  '#22C55E',
        warning:  '#F59E0B',
        danger:   '#EF4444',
        info:     '#3B82F6',
      },
      fontFamily: {
        display: ['var(--font-baloo)', 'sans-serif'],
        body:    ['var(--font-outfit)', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'manki-gradient':      'linear-gradient(135deg, #FFD700 0%, #FF6B00 50%, #E55A00 100%)',
        'manki-dark':          'linear-gradient(180deg, #0A0A0F 0%, #111118 40%, #0A0A0F 100%)',
        'strip-gradient':      'linear-gradient(90deg, #FFD700, #FF6B00)',
        'card-gradient':       'linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,107,0,0.03))',
        'glow-radial':         'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'manki':     '0 0 40px rgba(255,107,0,0.25), 0 0 80px rgba(255,215,0,0.08)',
        'manki-sm':  '0 0 20px rgba(255,107,0,0.2)',
        'card':      '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,0,0.1)',
        'gold':      '0 0 30px rgba(255,215,0,0.3)',
        'inset':     'inset 0 1px 0 rgba(255,215,0,0.1)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 10s ease-in-out infinite',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'slide-up':     'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-r':   'slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fadeIn 0.4s ease forwards',
        'grain':        'grain 0.5s steps(1) infinite',
        'stripe-scroll':'stripeScroll 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-18px) rotate(1.5deg)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(255,107,0,0.3)' },
          '50%':     { boxShadow: '0 0 50px rgba(255,107,0,0.6), 0 0 80px rgba(255,215,0,0.2)' },
        },
        slideUp: {
          '0%':   { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: 0, transform: 'translateX(20px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%':     { transform: 'translate(-2%, -3%)' },
          '20%':     { transform: 'translate(3%, 2%)' },
          '30%':     { transform: 'translate(-1%, 4%)' },
          '40%':     { transform: 'translate(2%, -1%)' },
          '50%':     { transform: 'translate(-3%, 3%)' },
          '60%':     { transform: 'translate(1%, -2%)' },
          '70%':     { transform: 'translate(-2%, 1%)' },
          '80%':     { transform: 'translate(3%, -3%)' },
          '90%':     { transform: 'translate(-1%, 2%)' },
        },
        stripeScroll: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
      },
      perspective: {
        '500':  '500px',
        '800':  '800px',
        '1200': '1200px',
      },
    },
  },
  plugins: [],
};
