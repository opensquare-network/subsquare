const {
  insertSoloReferendum,
} = require("../../../common/democracy/referendum/insert");

async function handleStarted(event, indexer) {
  await insertSoloReferendum(...arguments);
}

module.exports = {
  handleStarted,
};
