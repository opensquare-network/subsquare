import { useUser } from "next-common/context/user";
import { usePost } from "next-common/context/post";
import usePostProxyAuthor from "./usePostProxyAuthor";
import { useIsPostAuthor } from "next-common/context/post/useIsPostAuthor";
import useIsAdmin from "./useIsAdmin";

export default function useCanEditPost() {
  const user = useUser();
  const post = usePost();
  const proxyAuthor = usePostProxyAuthor();
  const isAuthor = useIsPostAuthor();
  const isAdmin = useIsAdmin();

  if (!user || !post) {
    return false;
  }

  const canEditByProxy = !!proxyAuthor;

  return isAuthor || canEditByProxy || isAdmin;
}
