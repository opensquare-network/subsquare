const { Modules, TipEvents } = require("../../common/constants");

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

  const eventData = data.toJSON();
  const [hash] = eventData;
  if (TipEvents.NewTip === method) {
  }
}
