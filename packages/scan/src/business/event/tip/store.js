const { getTipReason } = require("../../common/tip/utils");
const { getTipMetaFromStorage } = require("../../common/tip/utils");
const {
  getNewTipCall,
  getTippersCount,
  getTipFindersFee,
} = require("../../common/tip/utils");
const {
  getTipCommonUpdates,
  computeTipValue,
} = require("../../common/tip/updates");
const {
  business: {
    consts: { TipMethods, TipEvents, TimelineItemTypes },
  },
} = require("@subsquare/scan-common");
const { getBlockHash } = require("../../common");
const { insertTip, updateTipByHash } = require("../../../mongo/service/tip");
const { insertTipPost } = require("../../../mongo/service/business/tip");
const {
  chain: { findBlockApi },
} = require("@subsquare/scan-common");

async function saveNewTip(event, extrinsic, indexer) {
  const [rawHash] = event.data;
  const hash = rawHash.toString();
  const blockApi = await findBlockApi(indexer.blockHash);
  const meta = await getTipMetaFromStorage(blockApi, hash, indexer);

  const signer = extrinsic.signer.toString();
  const authorSet = new Set();
  authorSet.add(signer);
  if (meta.finder) {
    authorSet.add(meta.finder);
  }
  const authors = [...authorSet];

  const reasonHash = meta.reason;
  const newTipCall = await getNewTipCall(
    blockApi.registry,
    extrinsic.method,
    reasonHash
  );
  const method = newTipCall.method;

  const reason = await getTipReason(reasonHash, indexer);
  meta.reason = reason;
  const beneficiary = newTipCall.args[1].toJSON();
  meta.findersFee = TipMethods.reportAwesome === method;
  const finder = meta.finder;
  const tippersCount = await getTippersCount(indexer);
  const tipFindersFee = await getTipFindersFee(indexer);
  const medianValue = computeTipValue(meta);

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
    authors,
    reason,
    finder,
    tippersCount,
    tipFindersFee,
    medianValue,
    meta,
    isFinal: false,
    state,
    timeline: [timelineItem],
  };

  await insertTip(obj);
  await insertTipPost(indexer, hash, reason, finder, state);
}

async function updateTipWithClosing(tipHash, indexer) {
  const updates = await getTipCommonUpdates(tipHash, indexer);
  await updateTipByHash(tipHash, updates);
}

async function updateTipWithTipClosed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, beneficiary, payout] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
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
    medianValue: payout,
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

async function updateTipWithTipRetracted(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
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

async function updateTipWithTipSlashed(event, extrinsic, indexer) {
  const eventData = event.data.toJSON();
  const [hash, finder, slashed] = eventData;

  const blockHash = await getBlockHash(indexer.blockHeight - 1);
  let updates = await getTipCommonUpdates(hash, {
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
