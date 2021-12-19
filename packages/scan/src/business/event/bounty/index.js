const { handleExtended } = require("./extended");
const { handleAwarded } = require("./awarded");
const { handleClaimed } = require("./claimed");
const { handleCanceled } = require("./canceled");
const { handleRejected } = require("./rejected");
const { handleBecameActive } = require("./becameActive");
const { handleProposed } = require("./proposed");
const {
  business: {
    consts: { Modules, BountyEvents },
  },
} = require("@subsquare/scan-common");

function isBountyEvent(section, method) {
  if (![Modules.Treasury, Modules.Bounties].includes(section)) {
    return false;
  }

  return BountyEvents.hasOwnProperty(method);
}

async function handleBountyEvent(event, indexer, extrinsic) {
  const { section, method } = event;
  if (!isBountyEvent(section, method)) {
    return;
  }

  if (method === BountyEvents.BountyProposed) {
    await handleProposed(...arguments);
  } else if (method === BountyEvents.BountyExtended) {
    await handleExtended(...arguments);
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
