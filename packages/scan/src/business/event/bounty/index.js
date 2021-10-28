const { handleAwarded } = require("./awared");
const { handleClaimed } = require("./claimed");
const { handleCanceled } = require("./canceled");
const { handleRejected } = require("./rejected");
const { handleBecameActive } = require("./becameActive");
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
  } else if (method === BountyEvents.BountyAwarded) {
    await handleAwarded(...arguments);
  } else if (method === BountyEvents.BountyClaimed) {
    await handleClaimed(...arguments);
  } else if (method === BountyEvents.BountyCanceled) {
    await handleCanceled(...arguments);
  } else if (method === BountyEvents.BountyRejected) {
    await handleRejected(...arguments);
  } else if (method === BountyEvents.BountyBecameActive) {
    await handleBecameActive(...arguments);
  }
}

module.exports = {
  handleBountyEvent,
};
