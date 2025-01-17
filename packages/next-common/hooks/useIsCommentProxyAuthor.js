import { useComment } from "next-common/components/comment/context";
import { useMyProxied } from "next-common/context/proxy";
import { isAddressInGroup } from "next-common/utils";

export default function useIsCommentProxyAuthor() {
  const comment = useComment();
  const { proxies } = useMyProxied();
  const delegators = proxies?.map((p) => p.delegator);
  return isAddressInGroup(comment?.proposer, delegators);
}
