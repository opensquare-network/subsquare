import { usePostState } from "next-common/context/post";

export default function useIsChildBountyFinished() {
  const state = usePostState();

  return ["Rejected", "Canceled", "Claimed", "Removed"].includes(state);
}
