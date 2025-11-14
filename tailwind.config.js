module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cute-pink': '#FFB6D9',
        'light-pink': '#FFE5F0',
        'dark-pink': '#FF69B4',
        'heart-red': '#FF1493'
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
        bounce: 'bounce 1s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1.2)' },
          '42%': { transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: []
}
