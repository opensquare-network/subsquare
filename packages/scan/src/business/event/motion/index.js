const { Modules, CouncilEvents } = require("../../common/constants");
const { handleProposed } = require("./store/proposed");

async function handleMotionEvent(registry, event, extrinsic, indexer) {
  const { section, method } = event;
  if (Modules.Council !== section) {
    return;
  }

  if (CouncilEvents.Proposed === method) {
    await handleProposed(registry, event, extrinsic, indexer);
  }
}

module.exports = {
  handleMotionEvent,
};
