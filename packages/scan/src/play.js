require("dotenv").config();

const { scanNormalizedBlock } = require("./scan/block");
const {
  chain: {
    getApi,
    specs: { setSpecHeights },
    fetchBlocks,
  },
} = require("@subsquare/scan-common");

async function test() {
  const blockHeights = [310206];

  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await fetchBlocks();

    await scanNormalizedBlock(block.block, allEvents);
  }

  console.log("finished");
}

test();
