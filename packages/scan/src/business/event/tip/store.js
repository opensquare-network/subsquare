const {
  getTipMeta,
  getNewTipCall,
  getTippersCount,
  getTipFindersFee,
} = require("../../common/tip/utils");
const { u8aToString } = require("@polkadot/util");
const {
  TipMethods,
  TipEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { insertTip } = require("../../../mongo/business/tip");

async function saveNewTip(registry, event, extrinsic, indexer) {
  const [hash] = event.data;
  const meta = await getTipMeta(indexer.blockHash, hash);

  const reasonHash = meta.reason;
  const newTipCall = await getNewTipCall(
    registry,
    extrinsic.method,
    reasonHash
  );
  const method = newTipCall.method;

  const reason = u8aToString(newTipCall.args[0]);
  meta.reason = reason;
  const beneficiary = newTipCall.args[1].toJSON();
  meta.findersFee = TipMethods.reportAwesome === method;
  const finder = meta.finder;
  const tippersCount = getTippersCount(registry);
  const tipFindersFee = getTipFindersFee(registry);

  const timelineItem = {
    type: TimelineItemTypes.extrinsic,
    method,
    args: {
      reason,
      beneficiary,
      finder,
    },
    indexer,
  };

  const obj = {
    indexer,
    hash: hash.toString(),
    reason,
    finder,
    tippersCount,
    tipFindersFee,
    meta,
    isClosedOrRetracted: false,
    state: {
      indexer,
      state: TipEvents.NewTip,
      data: event.data.toJSON(),
    },
    timeline: [timelineItem],
  };

  await insertTip(obj);
  /**
   * TODO: Think whether we need to create separate table for corresponding post for this tip
   */
}

module.exports = {
  saveNewTip,
};
