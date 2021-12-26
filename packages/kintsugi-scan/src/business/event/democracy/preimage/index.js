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
  }
}

module.exports = {
  handlePreImageEvent,
};
