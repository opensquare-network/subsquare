const { Modules, TipEvents } = require("../../common/constants");
const { saveNewTip } = require("./store");
const { updateTipWithClosing } = require("./store");

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
  }
}

module.exports = {
  handleTipEvent,
};
