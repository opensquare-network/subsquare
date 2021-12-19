const consts = require("./common/constants");

module.exports = {
  consts,
  ...require("./common/treasuryProposal/meta"),
  ...require("./common/call"),
};
