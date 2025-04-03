/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    daisyui: { 
        themes: ["light", "dark", "cupcake", "bumblebee","retro","synthwave","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula"],
    },
    plugins: [require('daisyui')],
  }
  