import safeLocalStorage from "next-common/utils/safeLocalStorage";
import { getAllRpcUrls } from "next-common/store/reducers/nodeSlice";

export default function getEndpointFromLocalStorage(chain) {
  let localNodeUrl = null;
  try {
    localNodeUrl = safeLocalStorage.getItem(`nodeUrl-${chain}`);
  } catch {
    // ignore parse error
  }

  const urls = getAllRpcUrls(chain);
  return urls.includes(localNodeUrl) ? localNodeUrl : null;
}
