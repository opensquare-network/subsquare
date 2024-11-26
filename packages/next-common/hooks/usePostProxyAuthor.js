import { usePost } from "next-common/context/post";
import { useMyProxied } from "next-common/context/proxy";
import { isSameAddress } from "next-common/utils";

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
    return (post.authors || []).some((postAuthor) =>
      isSameAddress(p.delegator, postAuthor),
    );
  });

  return proxy?.delegator;
}
