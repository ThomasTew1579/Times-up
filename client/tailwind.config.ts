// import { defineConfig } from 'vite'
// import tailwindcss from '@tailwindcss/vite'
// export default defineConfig({
//   plugins: [
//     tailwindcss(),
//   ],
//   purge: [
//     './index.html',
//     './src/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         "primary-100": '#c2dfff',
//         "primary-200": '#81b6f2',
//         "primary-600": '#233A5F',
//         "primary-900": '#252773',
//       },
//       backgroundImage: {
//         "primary-gradient": "linear-gradient(240deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%)",
//         "primary-gradient-40": "linear-gradient(60deg, rgba(84,58,183,0.1) 0%, rgba(0,172,193,0.1) 100%)",
//       },
//       fontFamily: {
//         primary: ['LuckiestGuy', 'cursive'],
//         secondary: ['Roboto', 'sans-serif'],
//       },
//     },
//   },
// })

import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        colors: {
          "primary-100": '#c2dfff',
          "primary-200": '#81b6f2',
          "primary-600": '#233A5F',
          "primary-900": '#252773',
        },
        backgroundImage: {
          "primary-gradient": "linear-gradient(240deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%)",
          "primary-gradient-40": "linear-gradient(60deg, rgba(84,58,183,0.1) 0%, rgba(0,172,193,0.1) 100%)",
        },
        fontFamily: {
          primary: ['LuckiestGuy'],
          secondary: ['Roboto', 'sans-serif'],
        },
      },
  },
  plugins: [],
} satisfies Config