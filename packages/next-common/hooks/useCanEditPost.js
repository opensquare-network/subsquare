import { useUser } from "next-common/context/user";
import { usePost } from "next-common/context/post";
import usePostProxyAuthor from "./usePostProxyAuthor";
import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";

export default function useCanEditPost() {
  const user = useUser();
  const post = usePost();
  const proxyAuthor = usePostProxyAuthor();
  const isAuthor = useIsPostAuthor();

  if (!user || !post) {
    return false;
  }

  const canEditByProxy = !!proxyAuthor;

  return isAuthor || canEditByProxy;
}
