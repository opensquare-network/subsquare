import getMetadata from "next-common/services/chain/apis/metadata";

/**
 * @param {string[]} endpoints
 * @param {object} [runtime] optional runtime API definitions to merge in, so
 * runtime calls stay decorated even if the cached metadata is stale
 */
export async function getChainApi(endpoints, runtime) {
  const { WsProvider, ApiPromise } = await import("@polkadot/api");

  const provider = new WsProvider(endpoints, 1000);
  const { id, metadata } = await getMetadata(provider);
  return await ApiPromise.create({
    provider,
    metadata: { [id]: metadata },
    ...(runtime ? { runtime } : {}),
  });
}

export async function getChainApiAt(api, blockHeightOrHash) {
  if (!blockHeightOrHash) {
    return api;
  } else if (/^\d+$/.test(blockHeightOrHash)) {
    const blockHash = await api.rpc.chain.getBlockHash(blockHeightOrHash);
    return api.at(blockHash);
  } else {
    return api.at(blockHeightOrHash);
  }
}
