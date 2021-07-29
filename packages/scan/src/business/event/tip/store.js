const { getTipMeta, getNewTipCall } = require("./utils");
const { u8aToString } = require("@polkadot/util");
const {
  TipMethods,
  TipEvents,
  TimelineItemTypes,
} = require("../../common/constants");

async function saveNewTip(registry, event, extrinsic, indexer) {
  const [hash] = event.data;
  let meta = await getTipMeta(indexer.blockHash, hash);

  if (Array.isArray(meta.finder)) {
    const [finder, deposit] = meta.finder;
    meta = {
      ...meta,
      finder,
      deposit,
    };
  }

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
    meta,
    isClosedOrRetracted: false,
    state: {
      indexer,
      state: TipEvents.NewTip,
      data: event.data.toJSON(),
    },
    timeline: [timelineItem],
  };

  /**
   * TODO: store new tip to database and create corresponding post for this tip
   */

  console.log("obj", obj);
}

module.exports = {
  saveNewTip,
};
