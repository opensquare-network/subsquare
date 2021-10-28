const { handleProposed } = require("./proposed");
const { Modules, BountyEvents } = require("../../common/constants");

function isTipEvent(section, method) {
  if (![Modules.Treasury, Modules.Bounties].includes(section)) {
    return false;
  }

  return BountyEvents.hasOwnProperty(method);
}

async function handleBountyEvent(event, indexer, extrinsic) {
  const { section, method, data } = event;
  if (!isTipEvent(section, method)) {
    return;
  }

  if (method === BountyEvents.BountyProposed) {
    await handleProposed(...arguments);
  }
}

module.exports = {
  handleBountyEvent,
};
