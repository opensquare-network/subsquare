import { useMyProxied } from "next-common/context/proxy";
import { isSameAddress } from "next-common/utils";

export default function useIsProxyAuthor(comment) {
  const { proxies } = useMyProxied();
  return proxies?.some((p) => isSameAddress(p.delegator, comment?.proposer));
}
