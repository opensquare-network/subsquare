const { md5 } = require("../utils");

const toUserPublicInfo = (user) => {
  if (!user) {
    return null;
  }

  const chain = process.env.CHAIN;
  return {
    username: user.username,
    emailMd5: md5(user.email.trim().toLocaleLowerCase()),
    addresses: user[`${chain}Address`]
      ? [
          {
            chain,
            address: user[`${chain}Address`],
          }
        ]
      : [],
  };
}

module.exports = {
  toUserPublicInfo,
};
