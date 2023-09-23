import { usePostState } from "next-common/context/post";
import { useDecisionDeposit } from "next-common/context/post/gov2/referendum";
import { gov2State } from "next-common/utils/consts/state";

export default function TimeoutGuard({ children }) {
  const state = usePostState();
  const deposit = useDecisionDeposit();
  if (gov2State.Preparing !== state || deposit) {
    return;
  }

  return children;
}
