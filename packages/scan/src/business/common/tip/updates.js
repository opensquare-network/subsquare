const { getTipMetaFromStorage } = require("./utils");
const { getTipByHash } = require("../../../mongo/service/tip");
const { getTippersCount, getTipFindersFee } = require("./utils");
const { getApi } = require("../../../api");

async function getTipCommonUpdates(registry, hash, { blockHeight, blockHash }) {
  const tipInDb = await getTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${hash}`);
  }

  const api = await getApi();
  const newMeta = await getTipMetaFromStorage(api, hash, {
    blockHeight,
    blockHash,
  });
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };
  const tippersCount = await getTippersCount(registry, blockHash);
  const tipFindersFee = getTipFindersFee(registry);

  return { meta, tippersCount, tipFindersFee };
}

module.exports = {
  getTipCommonUpdates,
};
