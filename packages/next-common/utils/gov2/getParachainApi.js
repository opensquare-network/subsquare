import { getChainSettingsPolyfill } from "../consts/settingsPolyfill";
import { getChainApi, getChainApiAt } from "../getChainApi";
import { getParachain } from "./relayToParachainDecodeSupport";

export async function getParachainApi(parachainIdNumber, blockHeightOrHash) {
  if (!parachainIdNumber) {
    return null;
  }

  const parachain = getParachain(parachainIdNumber);
  if (!parachain) {
    return null;
  }

  const endpointsUrls = getChainSettingsPolyfill(parachain)
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
