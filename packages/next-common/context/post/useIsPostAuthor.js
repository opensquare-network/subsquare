import { useUser } from "../user";
import { usePost } from "./index";
import { useDetailType } from "../page";

export function useIsPostAuthor() {
  const user = useUser();
  if (!user) {
    return false;
  }

  const post = usePost();
  const type = useDetailType();
  if (type === "post") {
    return post.author?.username === user.username;
  }

  return post?.authors?.includes(user.address);
}
