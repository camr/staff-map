const SVGSpritemapPlugin = require("svg-spritemap-webpack-plugin");

module.exports = {
  devServer: {
    host: "localhost",
    https: true,
    port: 4000,
  },

  configureWebpack: config => {
    config.plugins.push(
      new SVGSpritemapPlugin(["src/assets/icons/zondicons/*.svg"], {
        output: {
          filename: "img/zondicons.svg",
          svgo: {
            plugins: [
              {
                removeComments: false,
                removeTitle: true,
              },
            ],
          },
        },
        sprite: {
          prefix: false,
          generate: {
            title: false,
          },
        },
      })
    );

    if (process.env.NODE_ENV === "development") {
      config.devtool = "eval-source-map";

      config.output.devtoolModuleFilenameTemplate = info =>
        info.resourcePath.match(/\.vue$/) &&
        !info.identifier.match(/type=script/)
          ? `webpack-generated:///${info.resourcePath}?${info.hash}`
          : `webpack-code:///${info.resourcePath}`;

      config.output.devtoolFallbackModuleFilenameTemplate =
        "webpack:///[resource-path]?[hash]";
    }
  },
};
