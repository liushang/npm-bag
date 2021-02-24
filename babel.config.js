module.exports = {
  presets: [ '@vue/app', [
    "@vue/babel-preset-jsx",
    {
      "injectH": false
    }
  ] ],
  plugins: ["transform-vue-jsx", "babel-plugin-jsx-v-model"]
}