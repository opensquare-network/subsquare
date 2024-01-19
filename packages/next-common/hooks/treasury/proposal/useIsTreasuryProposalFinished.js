import { usePostState } from "next-common/context/post";

export default function useIsTreasuryProposalFinished() {
  const state = usePostState();
  return ["Awarded", "Rejected", "Approved"].includes(state);
}
