import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import { useDecisionDeposit } from "next-common/hooks/referenda/useReferendumInfo";

export default function TimeoutGuard({ children }) {
  const state = usePostState();
  const deposit = useDecisionDeposit();
  if (gov2State.Preparing !== state || deposit) {
    return;
  }

  return children;
}
