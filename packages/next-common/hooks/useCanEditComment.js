import { useComment } from "next-common/components/comment/context";
import { useUser } from "next-common/context/user";
import useIsCommentProxyAuthor from "./useIsCommentProxyAuthor";

export default function useCanEditComment() {
  const user = useUser();
  const comment = useComment();
  const isProxyAuthor = useIsCommentProxyAuthor();
  if (!user) {
    return false;
  }

  const isAuthor = comment?.author?.username === user.username;

  return isAuthor || isProxyAuthor;
}
