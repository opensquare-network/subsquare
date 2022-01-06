const { checkReferendumAtStarted } = require("./started");
const { handleCancelled } = require("./cancelled");
const { handleNotPassed } = require("./notPassed");
const { handlePassed } = require("./passed");
const { handleExecuted } = require("./executed");
const {
  business: {
    consts: { Modules, ReferendumEvents },
  },
} = require("@subsquare/scan-common");

function isReferendumEvent(section, method) {
  if (![Modules.Democracy].includes(section)) {
    return false;
  }

  return ReferendumEvents.hasOwnProperty(method);
}

async function handleReferendumEvent(event, indexer, extrinsic, blockEvents) {
  const { section, method } = event;
  if (!isReferendumEvent(section, method)) {
    return;
  }

  if (ReferendumEvents.Started === method) {
    // note: referendum discovery will be done by 2 points
    // 1. Democracy#Tabled, we insert referendum when handling public proposal
    // 2. FastTrack extrinsic
    await checkReferendumAtStarted(event, indexer);
  } else if (ReferendumEvents.Executed === method) {
    await handleExecuted(event, indexer);
  } else if (ReferendumEvents.Passed === method) {
    await handlePassed(event, indexer);
  } else if (ReferendumEvents.NotPassed === method) {
    await handleNotPassed(event, indexer);
  } else if (ReferendumEvents.Cancelled === method) {
    await handleCancelled(event, indexer);
  }
}

module.exports = {
  handleReferendumEvent,
};
