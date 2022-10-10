import { useUser } from "../user";
import { usePost } from "./index";

export function useIsThumbUp() {
  const user = useUser();
  if (!user) {
    return false;
  }

  const post = usePost();
  return post?.reactions?.findIndex((r) => r.user?.username === user.username) > -1;
}
