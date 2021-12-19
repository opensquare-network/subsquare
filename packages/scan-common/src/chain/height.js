const { getApi } = require("./api");

let latestHeight = null;

async function subscribeFinalizedHead() {
  const api = await getApi();

  await new Promise((resolve) => {
    api.rpc.chain.subscribeFinalizedHeads((header) => {
      latestHeight = header.number.toNumber();
      resolve(latestHeight);
    });
  });
}

function getChainLatestHeight() {
  return latestHeight;
}

module.exports = {
  subscribeFinalizedHead,
  getChainLatestHeight,
};
