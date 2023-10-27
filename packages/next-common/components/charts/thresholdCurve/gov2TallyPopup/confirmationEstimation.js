import isNil from "lodash.isnil";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import Tooltip from "next-common/components/tooltip";
import dayjs from "dayjs";
import useConfirmationEstimateTime from "next-common/hooks/useConfirmationEstimateTime";

function PercentageGuard({ approvePercentage, supportPercentage, children }) {
  if (isNil(approvePercentage) || isNil(supportPercentage)) {
    return null;
  }

  return children;
}

function Estimation({ approvePercentage, supportPercentage }) {
  const { estimatedTimeToConfirm, maybeConfirmAtTimestamp } =
    useConfirmationEstimateTime({ approvePercentage, supportPercentage });

  if (!estimatedTimeToConfirm || !maybeConfirmAtTimestamp) {
    return null;
  }

  return (
    <div className="px-[16px] py-[10px] rounded-[8px] bg-neutral200 text-textSecondary text14Medium">
      Based on current voting results, the referenda will start confirmation in{" "}
      <Tooltip
        content={dayjs(maybeConfirmAtTimestamp).format("YYYY-MM-DD HH:mm")}
      >
        <span className="text-theme500">{estimatedTimeToConfirm}</span>
      </Tooltip>
    </div>
  );
}

export default function ConfirmationEstimation({
  approvePercentage,
  supportPercentage,
}) {
  const state = usePostState();
  if (gov2State.Deciding !== state) {
    return null;
  }

  return (
    <PercentageGuard
      approvePercentage={approvePercentage}
      supportPercentage={supportPercentage}
    >
      <Estimation
        approvePercentage={approvePercentage}
        supportPercentage={supportPercentage}
      />
    </PercentageGuard>
  );
}
