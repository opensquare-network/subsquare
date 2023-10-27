const isNil = require("lodash.isnil");
const { usePostState } = require("next-common/context/post");
const { gov2State } = require("next-common/utils/consts/state");

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
