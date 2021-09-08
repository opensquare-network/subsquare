const { handleProposed } = require("./service/proposed");
const { Modules, TechnicalCommitteeEvents } = require("../../common/constants");

function isTechCommModule(section) {
  return Modules.TechnicalCommittee === section;
}

async function handleTechCommMotionEvent(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isTechCommModule(section)) {
    return;
  }

  if (TechnicalCommitteeEvents.Proposed === method) {
    await handleProposed(...arguments);
  }
  // TODO: handle related business
}

module.exports = {
  handleTechCommMotionEvent,
};
