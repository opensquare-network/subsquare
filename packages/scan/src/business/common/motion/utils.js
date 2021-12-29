const {
  env: { isKarura },
  business: {
    consts: { KaruraModules, Modules },
  },
} = require("@subsquare/scan-common");

function getCouncilName() {
  if (isKarura()) {
    return KaruraModules.GeneralCouncil;
  } else {
    return Modules.Council;
  }
}

module.exports = {
  getCouncilName,
};
