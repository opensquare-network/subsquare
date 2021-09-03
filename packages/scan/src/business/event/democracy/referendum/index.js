const { Modules, ReferendumEvents } = require("../../../common/constants");

function isReferendumEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return ReferendumEvents.hasOwnProperty(method);
}

async function handleReferendumEventWithExtrinsic(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }
  // TODO: handle the business
}

async function handleReferendumEventWithoutExtrinsic(
  blockIndexer,
  event,
  sort,
  allEvents
) {
  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }

  // TODO: handle the business
}

module.exports = {
  handleReferendumEventWithExtrinsic,
};
