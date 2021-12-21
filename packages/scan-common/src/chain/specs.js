const { getAllVersionChangeHeights, getScanHeight } = require("../mongo/meta");
const findLast = require("lodash.findlast");
const { findBlockApi } = require("./blockApi");
const { isUseMetaDb: isUseMeta } = require("../env");
const { getProvider, getApi } = require("./api");
const { hexToU8a, isHex } = require("@polkadot/util");

let versionChangedHeights = [];
let metaScanHeight = 1;

async function updateSpecs() {
  if (!isUseMeta()) {
    return;
  }

  versionChangedHeights = await getAllVersionChangeHeights();
  metaScanHeight = await getScanHeight();
}

function getSpecHeights() {
  return versionChangedHeights;
}

function getMetaScanHeight() {
  return metaScanHeight;
}

// For test
async function setSpecHeights(heights = []) {
  const api = await getApi();
  for (const height of heights) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const provider = getProvider();
    const runtimeVersion = await provider.send("chain_getRuntimeVersion", [
      blockHash,
    ]);
    versionChangedHeights.push({
      height,
      runtimeVersion,
    });
  }

  metaScanHeight = heights[heights.length - 1];
}

async function findRegistry({ blockHash, blockHeight: height }) {
  if (!isUseMeta()) {
    const blockApi = await findBlockApi(blockHash);
    return blockApi.registry;
  }

  const spec = findMostRecentSpec(height);
  const api = await getApi();

  let u8aHash = blockHash;
  if (isHex(blockHash)) {
    u8aHash = hexToU8a(u8aHash);
  }

  return (await api.getBlockRegistry(u8aHash, spec.runtimeVersion)).registry;
}

function findMostRecentSpec(height) {
  const spec = findLast(versionChangedHeights, (h) => h.height <= height);
  if (!spec) {
    throw new Error(`Can not find height ${height}`);
  }

  return spec;
}

module.exports = {
  updateSpecs,
  getSpecHeights,
  findRegistry,
  setSpecHeights,
  getMetaScanHeight,
};
