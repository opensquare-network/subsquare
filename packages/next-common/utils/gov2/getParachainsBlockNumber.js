import { getChainApiAt } from "../getChainApi";

export async function getParachainsBlockNumber(
  api,
  parachainId,
  blockHeightOrHash,
) {
  const apiAt = await getChainApiAt(api, blockHeightOrHash);
  const paraHeadData = await apiAt?.query?.paras.heads(parachainId);
  const header = api.registry.createType("Header", paraHeadData.unwrap());
  return header.number;
}
