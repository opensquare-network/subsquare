const {
  Modules,
  CouncilEvents,
  KaruraModules,
} = require("../../common/constants");
const { handleProposed } = require("./store/proposed");
const { handleVoted } = require("./store/voted");
const { isKarura } = require("../../../env");

function isCouncilModule(section) {
  if (isKarura()) {
    return KaruraModules.GeneralCouncil === section;
  }

  return Modules.Council === section;
}

async function handleMotionEvent(registry, event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isCouncilModule(section)) {
    return;
  }

  if (CouncilEvents.Proposed === method) {
    await handleProposed(registry, event, extrinsic, indexer);
  } else if (CouncilEvents.Voted === method) {
    await handleVoted(registry, event, extrinsic, indexer);
  }
}

module.exports = {
  handleMotionEvent,
};
