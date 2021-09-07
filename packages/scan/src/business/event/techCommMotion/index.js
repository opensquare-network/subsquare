const { Modules, TechnicalCommitteeEvents } = require("../../common/constants");

function isTechCommModule(section) {
  return Modules.TechnicalCommittee === section;
}

async function handleTechCommMotionEvent(event, extrinsic, indexer) {
  const { section, method } = event;
  if (!isTechCommModule(section)) {
    return;
  }

  // TODO: handle related business
}

module.exports = {
  handleTechCommMotionEvent,
};
