const { SupportChains } = require("../constants");
const { md5 } = require("../utils");

const toUserPublicInfo = (user) => {
  if (!user) {
    return null;
  }

  return {
    username: user.username,
    emailMd5: md5(user.email.trim().toLocaleLowerCase()),
    addresses: SupportChains.map(chain => ({
      chain,
      address: user[`${chain}Address`]
    })).filter(p => p.address),
  };
};

module.exports = {
  toUserPublicInfo,
};
