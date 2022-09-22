module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "react-native-dotenv",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      "tailwindcss-react-native/babel",
      "react-native-reanimated/plugin",
    ],
    presets: ["babel-preset-expo", "module:metro-react-native-babel-preset"],
  };
};
