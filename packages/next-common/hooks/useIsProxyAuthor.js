import { useMyProxied } from "next-common/context/proxy";
import { isSameAddress } from "next-common/utils";

export default function useIsProxyAuthor(commentOrPost) {
  const { proxies } = useMyProxied();
  return proxies?.some((p) =>
    isSameAddress(p.delegator, commentOrPost?.proposer),
  );
}
