import { useConfirmingStarted } from "next-common/context/post/gov2/referendum";
import { useTimelineData } from "next-common/context/post";
import { findLast } from "lodash-es";
import { gov2State } from "next-common/utils/consts/state";
import { useConfirmPeriod } from "next-common/context/post/gov2/track";
import { ProgressBarWrapper, ProgressGroup, Tooltip } from "../styled";
import Progress from "next-common/components/progress";
import ConfirmationInfo from "./confirmationInfo";

export function useAbortedOrRejectedHeight(confirmStartedHeight) {
  const timeline = useTimelineData();
  const confirmAbortedItem = findLast(
    timeline,
    (item) =>
      item.name === "ConfirmAborted" &&
      item.indexer.blockHeight > confirmStartedHeight,
  );
  if (confirmAbortedItem) {
    return confirmAbortedItem?.indexer?.blockHeight;
  }

  const rejectedItem = findLast(
    timeline,
    (item) => item.name === gov2State.Rejected,
  );
  return rejectedItem?.indexer?.blockHeight;
}

export default function LastConfirmationProgress() {
  const startedHeight = useConfirmingStarted();
  const rejectedHeight = useAbortedOrRejectedHeight(startedHeight);
  const confirmPeriod = useConfirmPeriod();
  const percentage = Number(
    ((rejectedHeight - startedHeight) / confirmPeriod) * 100,
  ).toFixed(2);

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip content={`Started at ${startedHeight}, ${percentage}%`}>
          <Progress
            percentage={parseFloat(percentage)}
            fg="var(--green500)"
            bg="var(--green100)"
          />
        </Tooltip>
      </ProgressBarWrapper>
      <ConfirmationInfo />
    </ProgressGroup>
  );
}
