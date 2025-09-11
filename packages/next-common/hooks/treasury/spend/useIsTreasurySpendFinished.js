import { usePostState } from "next-common/context/post";

export default function useIsTreasurySpendFinished() {
  const state = usePostState();

  return ["Paid", "Processed"].includes(state);
}
