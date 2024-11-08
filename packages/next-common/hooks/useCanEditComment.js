import { useComment } from "next-common/components/comment/context";
import { useUser } from "next-common/context/user";
import useIsProxyAuthor from "./useIsProxyAuthor";

export default function useCanEditComment() {
  const user = useUser();
  const comment = useComment();
  const isProxyAuthor = useIsProxyAuthor(comment);

  if (!user) {
    return false;
  }

  const isAuthor = comment?.author?.username === user.username;

  return isAuthor || isProxyAuthor;
}
