const { handleUsed } = require("./used");
const { handleNoted } = require("./noted");
const {
  business: {
    consts: { Modules, PreImageEvents },
  },
} = require("@subsquare/scan-common");

async function handlePreImageEvent(event, indexer) {
  const { section, method } = event;

  if (Modules.Democracy !== section || !PreImageEvents.hasOwnProperty(method)) {
    return;
  }

  if (PreImageEvents.PreimageNoted === method) {
    await handleNoted(event, indexer);
  } else if (PreImageEvents.PreimageUsed === method) {
    await handleUsed(event, indexer);
  }
}

module.exports = {
  handlePreImageEvent,
};
