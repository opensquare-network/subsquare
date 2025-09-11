import { useFindMyUpVote } from "next-common/sima/actions/common";
import { usePost } from "./index";

export function useMyUpVote() {
  const post = usePost();
  const findMyUpVote = useFindMyUpVote();
  return findMyUpVote(post?.reactions);
}
