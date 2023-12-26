import getChainSettings from "next-common/utils/consts/settings";

export default function getEndpointFromLocalStorage(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = localStorage.getItem("nodeUrl");
  } catch (e) {
    // ignore parse error
  }

  const settings = getChainSettings(chain);
  const chainNodes = settings.endpoints;
  return (chainNodes || []).find(({ url }) => url === localNodeUrl);
}
