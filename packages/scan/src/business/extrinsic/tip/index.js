const {
  TipMethods,
  Modules,
  TimelineItemTypes,
} = require("../../common/constants");
const {
  getTipByHash,
  updateTipByHash,
} = require("../../../mongo/business/tip");
const { getTipMeta } = require("../../common/tip/utils");

async function handleTipCall(call, author, extrinsicIndexer) {
  if (
    ![Modules.Treasury, Modules.Tips].includes(call.section) ||
    TipMethods.tip !== call.method
  ) {
    return;
  }

  const {
    args: { hash, tip_value: tipValue },
  } = call.toJSON();

  const tipInDb = await getTipByHash(hash);
  if (!tipInDb) {
    throw new Error(`can not find tip in db. hash: ${hash}`);
  }

  const newMeta = await getTipMeta(extrinsicIndexer.blockHash, hash);
  const meta = {
    ...tipInDb.meta,
    tips: newMeta.tips,
    closes: newMeta.closes,
  };

  const updates = { meta };
  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method: TipMethods.tip,
    args: {
      tipper: author,
      value: tipValue,
    },
    indexer: extrinsicIndexer,
  };

  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  handleTipCall,
};
