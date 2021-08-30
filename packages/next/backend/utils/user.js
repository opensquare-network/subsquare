const { SupportChains } = require("../constants");
const { md5 } = require("../utils");

const toUserPublicInfo = (item) => ({
  username: item.username,
  emailMd5: md5(item.email.trim().toLocaleLowerCase()),
  addresses: SupportChains.map(chain => ({
    chain,
    address: item[`${chain}Address`]
  })).filter(p => p.address),
});

module.exports = {
  toUserPublicInfo,
};
