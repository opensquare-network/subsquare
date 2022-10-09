import { useUser } from "../user";
import { usePost, usePostType } from "./index";

export function useIsPostAuthor() {
  const user = useUser();
  if (!user) {
    return false;
  }

  const post = usePost();
  const type = usePostType();
  if (type === "post") {
    return post.author?.username === user.username;
  }

  return post?.authors?.includes(user.address);
}
