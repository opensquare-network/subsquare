import getMetadata from "next-common/services/chain/apis/metadata";

export async function getChainApi(endpoints) {
  const { WsProvider, ApiPromise } = await import("@polkadot/api");

  const provider = new WsProvider(endpoints, 1000);
  const { id, metadata } = await getMetadata(provider);
  return await ApiPromise.create({
    provider,
    metadata: { [id]: metadata },
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
