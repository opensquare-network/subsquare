const {
  env: { isKarura },
} = require("@subsquare/scan-common");

function getCouncilName() {
  if (isKarura()) {
    return "generalCouncil";
  } else {
    return "council";
  }
}

module.exports = {
  getCouncilName,
};
