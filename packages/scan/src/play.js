const { scanNormalizedBlock } = require("./scan/block");
const { getApi } = require("./api");
const { getRegistryByHeight } = require("./utils/registry");
const { setSpecHeights } = require("./specs");

async function test() {
  const blockHeights = [160545];

  for (const height of blockHeights) {
    setSpecHeights([height - 1]);

    const api = await getApi();
    const registry = await getRegistryByHeight(height);
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    const allEvents = await api.query.system.events.at(blockHash);

    await scanNormalizedBlock(registry, block.block, allEvents);
  }
}

test();
