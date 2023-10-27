import Tooltip from "next-common/components/tooltip";
import dayjs from "dayjs";
import useConfirmationEstimateTime from "next-common/hooks/useConfirmationEstimateTime";
import ConfirmationEstimationGuard from "next-common/components/tally/confirmationEstimationGuard";

function Estimation({ approvePercentage, supportPercentage }) {
  const { estimatedTimeToConfirm, maybeConfirmAtTimestamp } =
    useConfirmationEstimateTime({
      approvePercentage,
      supportPercentage,
    });

  if (!estimatedTimeToConfirm || !maybeConfirmAtTimestamp) {
    return null;
  }

  return (
    <div className="my-[16px] px-[16px] py-[10px] rounded-[8px] bg-neutral200 text-textSecondary text14Medium">
      Confirmation in{" "}
      <Tooltip
        content={`${dayjs(maybeConfirmAtTimestamp).format(
          "YYYY-MM-DD HH:mm",
        )}, estimated by current tally`}
      >
        <span className="text-theme500 text14Bold">
          {estimatedTimeToConfirm}
        </span>
      </Tooltip>
    </div>
  );
}

export default function ConfirmationEstimation({
  approvePercentage,
  supportPercentage,
}) {
  return (
    <ConfirmationEstimationGuard
      approvePercentage={approvePercentage}
      supportPercentage={supportPercentage}
    >
      <Estimation
        approvePercentage={approvePercentage}
        supportPercentage={supportPercentage}
      />
    </ConfirmationEstimationGuard>
  );
}
