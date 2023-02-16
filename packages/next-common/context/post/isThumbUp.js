import { useUser } from "../user";
import { usePost } from "./index";

export function useIsThumbUp() {
  const user = useUser();
  const post = usePost();
  if (!user) {
    return false;
  }

  return (
    post?.reactions?.findIndex((r) => r.user?.username === user.username) > -1
  );
}
