module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.js'),
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    })
  ],
}
