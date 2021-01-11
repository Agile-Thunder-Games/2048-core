const { join } = require("path");

module.exports = {
    outputPath: join(__dirname, "../", "dist"),
    srcPath: join(__dirname, "../", "src"),
    cssPath: join(this.srcPath, "css"),
    tsPath: join(this.srcPath, "ts"),
};