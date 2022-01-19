const { md5 } = require("../utils");

const toUserPublicInfo = (item) => {
  const chain = process.env.CHAIN;
  return ({
    username: item.username,
    emailMd5: md5(item.email.trim().toLocaleLowerCase()),
    addresses: item[`${chain}Address`]
      ? [
          {
            chain,
            address: item[`${chain}Address`],
          }
        ]
      : [],
  });
}

module.exports = {
  toUserPublicInfo,
};
