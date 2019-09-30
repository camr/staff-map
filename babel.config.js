module.exports = {
  presets: [
    ["@vue/babel-preset-jsx"],
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
        jsx: {
          injectH: false,
        },
      },
    ],
  ],
};
