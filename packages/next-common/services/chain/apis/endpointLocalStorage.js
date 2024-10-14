import getChainSettings from "next-common/utils/consts/settings";

export default function getEndpointFromLocalStorage(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = localStorage.getItem(`nodeUrl-${chain}`);
  } catch (e) {
    // ignore parse error
  }

  const settings = getChainSettings(chain);
  const chainNodes = settings.endpoints;
  const targetNode = (chainNodes || []).find(({ url }) => url === localNodeUrl);
  return targetNode?.url;
}
