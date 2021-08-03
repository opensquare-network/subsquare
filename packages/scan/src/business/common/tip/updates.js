const { getTipByHash } = require("../../../mongo/service/tip");
const { getTippersCount, getTipFindersFee, getTipMeta } = require("./utils");

async function getTipCommonUpdates(registry, hash, blockHash) {
  const tipInDb = await getTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${hash}`);
  }

  const newMeta = await getTipMeta(blockHash, hash);
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };
  const tippersCount = getTippersCount(registry);
  const tipFindersFee = getTipFindersFee(registry);

  return { meta, tippersCount, tipFindersFee };
}

module.exports = {
  getTipCommonUpdates,
};
