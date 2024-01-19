import { usePostState } from "next-common/context/post";

export default function useIsBountyFinished() {
  const state = usePostState();
  return [
    "BountyRejected",
    "Rejected",
    "BountyCanceled",
    "BountyClaimed",
    "Removed",
  ].includes(state);
}
