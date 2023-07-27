import {
  ProgressBarWrapper,
  ProgressGroup,
  ProgressInfo,
  ProgressTooltipFailContent,
  Tooltip,
} from "./styled";
import { useConfirm } from "next-common/context/post/gov2/track";
import {
  calcConfirmStartPercentage,
  useConfirmStartPercentage,
  useConfirmEndPercentage,
  useConfirmRemaining,
  useConfirmPercentage,
} from "./useConfirmPercentage";
import Remaining from "./remaining";
import Progress from "next-common/components/progress";
import MultiProgress from "next-common/components/progress/multiProgress";
import { useMemo } from "react";
import {
  useConfirmingStarted,
  useConfirmTimelineFailPairs,
  useDecidingSince,
  userConfirmingAborted,
} from "next-common/context/post/gov2/referendum";
import isNil from "lodash.isnil";
import TimeDuration from "next-common/components/TimeDuration";
import { useDecisionBlocks } from "./useDecisionPercentage";
import { useZoomMode, zoomModes } from "./context/zoomContext";

function ConfirmationInfo() {
  const confirmPeriod = useConfirm();

  return (
    <ProgressInfo>
      <span>Confirmation</span>
      <span>
        <TimeDuration blocks={confirmPeriod} />
      </span>
    </ProgressInfo>
  );
}

function Empty() {
  const confirmStart = useConfirmingStarted();
  if (confirmStart) {
    return null;
  }

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip content="Not started yet">
          <Progress percentage={0} bg="var(--neutral200)" />
        </Tooltip>
      </ProgressBarWrapper>

      <ConfirmationInfo />
    </ProgressGroup>
  );
}

function ConfirmSingleProgress() {
  const confirmPercentage = useConfirmPercentage();
  const confirmRemaining = useConfirmRemaining();

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip
          content={
            confirmRemaining > 0 && <Remaining blocks={confirmRemaining} />
          }
        >
          <Progress
            percentage={confirmPercentage}
            fg="var(--green500)"
            bg="var(--green100)"
          />
        </Tooltip>
      </ProgressBarWrapper>

      <ConfirmationInfo />
    </ProgressGroup>
  );
}

function ConfirmMultiProgress() {
  const confirmRemaining = useConfirmRemaining();
  const confirmStart = useConfirmingStarted();
  const confirmAbortedHeight = userConfirmingAborted();
  const confirmStartPercentage = useConfirmStartPercentage();
  const confirmEndPercentage = useConfirmEndPercentage();
  const decisionBlocks = useDecisionBlocks();
  const decisionSince = useDecidingSince();
  const confirmFailPairs = useConfirmTimelineFailPairs();
  const confirmPercentage = useConfirmPercentage();

  const progressItems = useMemo(() => {
    const items = confirmFailPairs.map((pair) => {
      const [started, aborted] = pair ?? [];

      const startedHeight = started?.indexer?.blockHeight;
      const abortedHeight = aborted?.indexer?.blockHeight;

      const start = calcConfirmStartPercentage(
        decisionSince,
        decisionBlocks,
        startedHeight,
      );
      const abortedHeightStart = calcConfirmStartPercentage(
        decisionSince,
        decisionBlocks,
        startedHeight + abortedHeight - startedHeight,
      );

      const end = abortedHeightStart - start;

      return {
        percentage: 100,
        start,
        end: end < 1 ? 1 : end,
        fg: "var(--neutral500)",
        tooltipContent: (
          <ProgressTooltipFailContent>
            <span>Started: {startedHeight?.toLocaleString?.()}</span>
            <span>
              Duration: <TimeDuration blocks={abortedHeight - startedHeight} />
            </span>
          </ProgressTooltipFailContent>
        ),
      };
    });

    if (
      isNil(confirmAbortedHeight) || // means no aborted records
      confirmAbortedHeight < confirmStart // mean has aborted records but not last confirmation aborted
    ) {
      items.push({
        percentage: confirmPercentage,
        start: confirmStartPercentage,
        end: confirmEndPercentage < 1 ? 1 : confirmEndPercentage,
        fg: "var(--green500)",
        bg: "var(--green300)",
        tooltipContent: confirmRemaining > 0 && (
          <Remaining blocks={confirmRemaining} />
        ),
      });
    }

    return items;
  }, [
    confirmStart,
    confirmAbortedHeight,
    confirmPercentage,
    confirmEndPercentage,
    confirmFailPairs,
    confirmRemaining,
    confirmStartPercentage,
    decisionBlocks,
    decisionSince,
  ]);

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <MultiProgress progressItems={progressItems.slice(0, 1)} />
      </ProgressBarWrapper>

      <ConfirmationInfo />
    </ProgressGroup>
  );
}

export default function ConfirmProgress() {
  const confirmStart = useConfirmingStarted();
  const mode = useZoomMode();

  if (!confirmStart) {
    return <Empty />;
  }

  if (mode === zoomModes.in) {
    return <ConfirmSingleProgress />;
  } else {
    return <ConfirmMultiProgress />;
  }
}
