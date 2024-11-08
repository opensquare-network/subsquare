import { useUser } from "next-common/context/user";
import useIsProxyAuthor from "./useIsProxyAuthor";

export default function useCanEditContent(commentOrPost) {
  const user = useUser();
  const isProxyAuthor = useIsProxyAuthor(commentOrPost);

  if (!user) {
    return false;
  }

  const isAuthor = commentOrPost?.author?.username === user.username;

  return isAuthor || isProxyAuthor;
}
