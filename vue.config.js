module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "/CedhCardWinrates/" : "/",
    outputDir: "/docs",
    devServer: {
      proxy: 'http://localhost:4000'
    }
  };
