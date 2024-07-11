import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { useAsync } from "react-use";

export function useIpfsContent(cid) {
  return useAsync(async () => {
    try {
      const resp = await fetch(getIpfsLink(cid));
      if (resp.ok) {
        return resp.text();
      } else {
        return new Error("Failed to fetch IPFS content");
      }
      // eslint-disable-next-line no-empty
    } finally {
    }
  }, [cid]);
}
