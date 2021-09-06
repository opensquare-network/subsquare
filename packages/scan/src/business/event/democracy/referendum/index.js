const { handleExecuted } = require("./executed");
const { handleNotPassed } = require("./notPassed");
const { handlePassed } = require("./passed");
const { handleCancelled } = require("./cancelled");
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

  if (ReferendumEvents.Cancelled === method) {
    await handleCancelled(...arguments);
  } else if (ReferendumEvents.Executed === method) {
    // executed can be triggered by either extrinsic or block execution
    await handleExecuted(event, indexer);
  }
}

async function handleReferendumEventWithoutExtrinsic(
  event,
  indexer,
  blockEvents
) {
  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }

  if (ReferendumEvents.Passed === method) {
    await handlePassed(...arguments);
  } else if (ReferendumEvents.NotPassed === method) {
    await handleNotPassed(...arguments);
  } else if (ReferendumEvents.Executed === method) {
    await handleExecuted(event, indexer);
  }
}

module.exports = {
  handleReferendumEventWithExtrinsic,
  handleReferendumEventWithoutExtrinsic,
};
