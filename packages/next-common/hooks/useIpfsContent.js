import getStorageLink from "next-common/utils/env/storageLink";
import { useAsync } from "react-use";

const REQUEST_TIMEOUT = 30000; // 30s

export function useIpfsContent(cid) {
  const result = useAsync(async () => {
    if (!cid) {
      return null;
    }

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout"));
      }, REQUEST_TIMEOUT);
    });

    const fetchPromise = fetch(getStorageLink(cid)).then((resp) => {
      if (resp.ok) {
        return resp.text();
      } else {
        throw new Error(resp.statusText);
      }
    });

    return Promise.race([fetchPromise, timeoutPromise]);
  }, [cid]);

  if (!cid) {
    return { value: null, loading: false, error: null };
  }

  return result;
}
