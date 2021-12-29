const specs = require("./specs");

module.exports = {
  ...require("./blockApi"),
  ...require("./api"),
  ...require("./height"),
  specs,
  ...require("./fetchBlocks"),
};
