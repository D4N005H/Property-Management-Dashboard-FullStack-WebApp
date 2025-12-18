/* eslint-disable import/no-anonymous-default-export */
/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    // tailwind plugin fix
    '@tailwindcss/postcss': {
      config: './tailwind.config.ts',
    },
    autoprefixer: {},
  },
}