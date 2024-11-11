import { useUser } from "next-common/context/user";
import { usePost } from "next-common/context/post";
import usePostProxyAuthor from "./usePostProxyAuthor";

export default function useCanEditPost() {
  const user = useUser();
  const post = usePost();
  const proxyAuthor = usePostProxyAuthor();

  if (!user || !post) {
    return false;
  }

  const isAuthor = post.author?.username === user.username;
  const canEditByProxy = !!proxyAuthor;

  return isAuthor || canEditByProxy;
}
