import getIpfsLink from "next-common/utils/env/ipfsEndpoint";
import { useAsync } from "react-use";

export function useIpfsContent(cid) {
  return useAsync(async () => {
    const resp = await fetch(getIpfsLink(cid));
    if (resp.ok) {
      return resp.text();
    } else {
      throw new Error(resp.statusText);
    }
  }, [cid]);
}
