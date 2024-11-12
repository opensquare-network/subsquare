import { useComment } from "next-common/components/comment/context";
import { useMyProxied } from "next-common/context/proxy";
import { isSameAddress } from "next-common/utils";

export default function useIsCommentProxyAuthor() {
  const comment = useComment();
  const { proxies } = useMyProxied();
  return proxies?.some((p) => isSameAddress(p.delegator, comment?.proposer));
}
