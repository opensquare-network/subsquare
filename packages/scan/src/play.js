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
  const blockHeights = [
    1977316, 2917347, 3232752, 3750457, 3750471, 3774408, 3830400, 3931200,
  ];

  for (const height of blockHeights) {
    await setSpecHeights([height - 1]);

    const api = await getApi();
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanNormalizedBlock(block.block, allEvents);
  }

  console.log("finished");
  process.exit(0);
}

test();
