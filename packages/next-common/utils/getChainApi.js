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
