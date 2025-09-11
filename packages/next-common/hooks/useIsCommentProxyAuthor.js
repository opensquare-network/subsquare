import { useComment } from "next-common/components/comment/context";
import { useMyProxied } from "next-common/context/proxy";
import { isAddressInGroup } from "next-common/utils";
import { useMemo } from "react";

export default function useIsCommentProxyAuthor() {
  const comment = useComment();
  const { proxies } = useMyProxied();
  const delegators = useMemo(() => proxies?.map((p) => p.delegator), [proxies]);
  return isAddressInGroup(comment?.proposer, delegators);
}
