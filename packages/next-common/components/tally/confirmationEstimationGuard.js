import { isNil } from "lodash-es";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";

export default function ConfirmationEstimationGuard({
  approvePercentage,
  supportPercentage,
  children,
}) {
  const state = usePostState();
  if (gov2State.Deciding !== state) {
    return null;
  }

  if (isNil(approvePercentage) || isNil(supportPercentage)) {
    return null;
  }

  return children;
}
