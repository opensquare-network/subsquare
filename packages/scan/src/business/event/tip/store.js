const { getTipReason } = require("../../common/tip/utils");
const { getTipMetaFromStorage } = require("../../common/tip/utils");
const {
  getNewTipCall,
  getTippersCount,
  getTipFindersFee,
} = require("../../common/tip/utils");
const { getTipCommonUpdates } = require("../../common/tip/updates");
const {
  TipMethods,
  TipEvents,
  TimelineItemTypes,
} = require("../../common/constants");
const { getBlockHash } = require("../../common");
const { insertTip, updateTipByHash } = require("../../../mongo/service/tip");
const { insertTipPost } = require("../../../mongo/service/business/tip");
const { getApi } = require("../../../api");

async function saveNewTip(registry, event, extrinsic, indexer) {
  const [rawHash] = event.data;
  const hash = rawHash.toString();
  const api = await getApi();
  const meta = await getTipMetaFromStorage(api, hash, indexer);

  const reasonHash = meta.reason;
  const newTipCall = await getNewTipCall(
    registry,
    extrinsic.method,
    reasonHash
  );
  const method = newTipCall.method;

  const reason = await getTipReason(reasonHash, indexer);
  meta.reason = reason;
  const beneficiary = newTipCall.args[1].toJSON();
  meta.findersFee = TipMethods.reportAwesome === method;
  const finder = meta.finder;
  const tippersCount = await getTippersCount(registry, indexer.blockHash);
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

  const state = {
    indexer,
    state: TipEvents.NewTip,
    data: event.data.toJSON(),
  };

  const obj = {
    indexer,
    hash,
    reason,
    finder,
    tippersCount,
    tipFindersFee,
    meta,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertTip(obj);
  await insertTipPost(indexer, hash, reason, finder, state);
}

async function updateTipWithClosing(registry, tipHash, indexer) {
  const updates = await getTipCommonUpdates(registry, tipHash, indexer);
  await updateTipByHash(tipHash, updates);
}

async function updateTipWithTipClosed(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, beneficiary, payout] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(registry, hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipClosed,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipClosed,
    args: {
      beneficiary,
      payout,
    },
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

async function updateTipWithTipRetracted(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(registry, hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipRetracted,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipRetracted,
    args: {},
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

async function updateTipWithTipSlashed(registry, event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, finder, slashed] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(registry, hash, {
    blockHeight: indexer.blockHeight - 1,
    blockHash,
  });
  const state = {
    indexer,
    state: TipEvents.TipSlashed,
    data: eventData,
  };
  updates = {
    ...updates,
    isFinal: true,
    state,
  };

  const timelineItem = {
    type: TimelineItemTypes.event,
    method: TipEvents.TipSlashed,
    args: {
      finder,
      slashed,
    },
    indexer,
  };
  await updateTipByHash(hash, updates, timelineItem);
}

module.exports = {
  saveNewTip,
  updateTipWithClosing,
  updateTipWithTipClosed,
  updateTipWithTipRetracted,
  updateTipWithTipSlashed,
};
