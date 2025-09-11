import { usePost } from "next-common/context/post";
import { useMyProxied } from "next-common/context/proxy";
import { isAddressInGroup, isSameAddress } from "next-common/utils";

export default function usePostProxyAuthor() {
  const { proxies } = useMyProxied();
  const post = usePost();
  if (!post) {
    return null;
  }

  const proxy = proxies?.find((p) => {
    if (isSameAddress(p.delegator, post.proposer)) {
      return true;
    }
    return isAddressInGroup(p.delegator, post.authors);
  });

  return proxy?.delegator;
}
