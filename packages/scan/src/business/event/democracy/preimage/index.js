const { handleNoted } = require("./noted");
const { Modules, PreImageEvents } = require("../../../common/constants");

async function handlePreImageEvent(event, extrinsic, indexer) {
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
