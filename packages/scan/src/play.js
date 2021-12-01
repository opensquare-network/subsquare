require("dotenv").config();

const { scanNormalizedBlock } = require("./scan/block");
const { getApi } = require("./api");
const { setSpecHeights } = require("./chain/specs");

async function test() {
  const blockHeights = [
    10121471, 10121572, 10121573, 10149210, 10149229, 10195200,
  ];

  for (const height of blockHeights) {
    setSpecHeights([height - 1]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanNormalizedBlock(block.block, allEvents);
  }
}

test();
