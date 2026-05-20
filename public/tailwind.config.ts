import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
    animation: {
  slowPulse: 'slowPulse 6s ease-in-out infinite',
  floatSlow: 'floatSlow 12s ease-in-out infinite',
  scanMove: 'scanMove 8s linear infinite',

  float: 'float 6s ease-in-out infinite',
  pulseSlow: 'pulseSlow 4s ease-in-out infinite',
  shimmer: 'shimmer 3s linear infinite',
},

      keyframes: {
        slowPulse: {
          '0%, 100%': {
            opacity: '0.35',
            transform: 'scale(1)',
          },

          '50%': {
            opacity: '0.7',
            transform: 'scale(1.04)',
          },
        },

        floatSlow: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },

          '50%': {
            transform: 'translateY(-18px)',
          },
        },

        scanMove: {
          '0%': {
            transform: 'translateY(-100%)',
          },

          '100%': {
            transform: 'translateY(100vh)',
          },
        },

        float: {
  '0%, 100%': {
    transform: 'translateY(0px)',
  },

  '50%': {
    transform: 'translateY(-10px)',
  },
},

pulseSlow: {
  '0%, 100%': {
    opacity: '1',
  },

  '50%': {
    opacity: '.6',
  },
},

shimmer: {
  '0%': {
    backgroundPosition: '-200% 0',
  },

  '100%': {
    backgroundPosition: '200% 0',
  },
},
      },
    },
  },

  plugins: [],
}

export default config