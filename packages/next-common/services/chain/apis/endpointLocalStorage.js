import safeLocalStorage from "next-common/utils/safeLocalStorage";
import { getAllRpcUrls } from "next-common/store/reducers/nodeSlice";
import { getNodeChainName } from "next-common/store/reducers/nodeSlice";

export default function getEndpointFromLocalStorage(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = safeLocalStorage.getItem(getNodeChainName());
  } catch (e) {
    // ignore parse error
  }

  const urls = getAllRpcUrls(chain);
  return urls.includes(localNodeUrl) ? localNodeUrl : null;
}
