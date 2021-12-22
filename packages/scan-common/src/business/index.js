const consts = require("./common/constants");

module.exports = {
  consts,
  ...require("./common/treasuryProposal/meta"),
  ...require("./common/call"),
  ...require("./common/bounty/meta"),
  ...require("./common/bounty/description"),
  ...require("./common/democracy"),
};
