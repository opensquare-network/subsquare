const { Modules, TipEvents } = require("../../common/constants");
const { saveNewTip } = require("./store");
const {
  updateTipWithClosing,
  updateTipWithTipClosed,
  updateTipWithTipSlashed,
  updateTipWithTipRetracted,
} = require("./store");

function isTipEvent(section, method) {
  if (![Modules.Treasury, Modules.Tips].includes(section)) {
    return false;
  }

  return TipEvents.hasOwnProperty(method);
}

async function handleTipEvent(registry, event, extrinsic, indexer) {
  const { section, method, data } = event;
  if (!isTipEvent(section, method)) {
    return;
  }

  if (TipEvents.NewTip === method) {
    await saveNewTip(registry, event, extrinsic, indexer);
  } else if (TipEvents.TipClosing === method) {
    const [hash] = data;
    await updateTipWithClosing(registry, hash.toString(), indexer.blockHash);
  } else if (TipEvents.TipClosed === method) {
    await updateTipWithTipClosed(registry, event, extrinsic, indexer);
  } else if (TipEvents.TipRetracted === method) {
    await updateTipWithTipRetracted(registry, event, extrinsic, indexer);
  } else if (TipEvents.TipSlashed === method) {
    await updateTipWithTipSlashed(registry, event, extrinsic, indexer);
  }
}

module.exports = {
  handleTipEvent,
};
