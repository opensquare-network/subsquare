import { getChainApi, getChainApiAt } from "../getChainApi";
import getChainSettings from "../consts/settings";
import { getParaChain } from "next-common/components/assets/paraChainTeleportPopup/teleportFromRelayChainToParaChain";

export async function getParachainApi(parachainId, blockHeightOrHash) {
  if (!parachainId) {
    return null;
  }

  const endpointsUrls = getChainSettings(getParaChain(parachainId))
    ?.endpoints?.map((item) => item.url)
    .filter(Boolean);

  if (!endpointsUrls?.length) {
    return null;
  }

  const api = await getChainApi(endpointsUrls);

  if (blockHeightOrHash) {
    return {
      api: await getChainApiAt(api, blockHeightOrHash),
      disconnect: () => api?.disconnect(),
    };
  }

  return {
    api,
    disconnect: () => api?.disconnect(),
  };
}
