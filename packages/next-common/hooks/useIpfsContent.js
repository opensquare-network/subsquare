import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { useAsync } from "react-use";

const REQUEST_TIMEOUT = 30000; // 30s

export function useIpfsContent(cid) {
  return useAsync(async () => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout"));
      }, REQUEST_TIMEOUT);
    });

    const fetchPromise = fetch(getIpfsLink(cid)).then((resp) => {
      if (resp.ok) {
        return resp.text();
      } else {
        throw new Error(resp.statusText);
      }
    });

    return Promise.race([fetchPromise, timeoutPromise]);
  }, [cid]);
}
