const { getTipMetaFromStorage } = require("./utils");
const { getTipByHash } = require("../../../mongo/service/tip");
const { getTippersCount, getTipFindersFee } = require("./utils");
const { getApi } = require("../../../api");

function median(values) {
  if (!Array.isArray(values)) {
    return null;
  }

  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function computeTipValue(tipMeta) {
  const tipValues = (tipMeta?.tips ?? []).map((tip) => tip[1]);
  return median(tipValues);
}

async function getTipCommonUpdates(hash, indexer) {
  const tipInDb = await getTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${hash}`);
  }

  const api = await getApi();
  const newMeta = await getTipMetaFromStorage(api, hash, indexer);
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };
  const tippersCount = await getTippersCount(indexer);
  const tipFindersFee = await getTipFindersFee(indexer);
  const medianValue = computeTipValue(newMeta);

  return { meta, tippersCount, tipFindersFee, medianValue };
}

module.exports = {
  getTipCommonUpdates,
  computeTipValue,
};
