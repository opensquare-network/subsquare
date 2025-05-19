import {
  ProgressBarWrapper,
  ProgressGroup,
  ProgressTooltipFailContent,
  Tooltip,
} from "./styled";
import {
  calcConfirmStartPercentage,
  useConfirmEndPercentage,
  useConfirmPercentage,
  useConfirmRemaining,
  useConfirmStartPercentage,
} from "./useConfirmPercentage";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";
import MultiProgress from "next-common/components/progress/multiProgress";
import { useMemo } from "react";
import {
  useConfirmingStarted,
  useConfirmTimelineFailPairs,
  useDecidingSince,
  useConfirmingAborted,
} from "next-common/context/post/gov2/referendum";
import { isNil } from "lodash-es";
import TimeDuration from "next-common/components/TimeDuration";
import { useDecisionBlocks } from "./useDecisionPercentage";
import { useZoomMode, zoomModes } from "./context/zoomContext";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import LastConfirmationProgress from "./confirmation/lastConfirmation";
import ConfirmationInfo from "./confirmation/confirmationInfo";

function Empty() {
  const confirmStart = useConfirmingStarted();
  if (confirmStart) {
    return null;
  }

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip content="No confirmations">
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
            confirmRemaining > 0 && (
              <Remaining
                blocks={confirmRemaining}
                percentage={confirmPercentage}
              />
            )
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
  const confirmAbortedHeight = useConfirmingAborted();
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
        <MultiProgress progressItems={progressItems} />
      </ProgressBarWrapper>

      <ConfirmationInfo />
    </ProgressGroup>
  );
}

export default function ConfirmProgress() {
  const confirmStart = useConfirmingStarted();
  const mode = useZoomMode();
  const state = usePostState();

  if (!confirmStart) {
    return <Empty />;
  }

  if (mode === zoomModes.out) {
    return <ConfirmMultiProgress />;
  }

  if (gov2State.Rejected === state) {
    return <LastConfirmationProgress />;
  }

  return <ConfirmSingleProgress />;
}
