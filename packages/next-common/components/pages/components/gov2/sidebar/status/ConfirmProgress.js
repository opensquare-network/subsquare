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
  useConfirmTimelineFinishedPairs,
  useDecidingSince,
} from "next-common/context/post/gov2/referendum";
import { isNil } from "lodash-es";
import TimeDuration from "next-common/components/TimeDuration";
import { useDecisionBlocks } from "./useDecisionPercentage";
import { useZoomMode, zoomModes } from "./context/zoomContext";
import { usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
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

const activeColorSettings = {
  fg: "var(--green500)",
  bg: "var(--green300)",
};

const inactiveColorSettings = {
  fg: "var(--neutral500)",
};

function useFinishedConfirmationProgressItems() {
  const decisionBlocks = useDecisionBlocks();
  const decisionSince = useDecidingSince();
  const confirmFailPairs = useConfirmTimelineFinishedPairs();

  return useMemo(() => {
    return (confirmFailPairs || []).map((pair) => {
      const [startedItem, abortedItem] = pair ?? [];
      const startedHeight = startedItem?.indexer?.blockHeight;
      const abortedHeight = abortedItem?.indexer?.blockHeight;

      const startPer = calcConfirmStartPercentage(
        decisionSince,
        decisionBlocks,
        startedHeight,
      );
      const abortedPer = calcConfirmStartPercentage(
        decisionSince,
        decisionBlocks,
        abortedHeight,
      );
      const length = abortedPer - startPer;
      const colorSettings =
        abortedItem?.name === "Confirmed"
          ? activeColorSettings
          : inactiveColorSettings;

      return {
        percentage: 100,
        start: startPer,
        length: length < 1 ? 1 : length,
        ...colorSettings,
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
  }, [confirmFailPairs, decisionBlocks, decisionSince]);
}

function useOngoingConfirmationProgressItem() {
  const state = usePostState();
  const confirmStart = useConfirmingStarted();
  const confirmStartPercentage = useConfirmStartPercentage();
  const confirmEndPercentage = useConfirmEndPercentage();
  const confirmPercentage = useConfirmPercentage();
  const confirmRemaining = useConfirmRemaining();

  return useMemo(() => {
    if (isNil(confirmStart) || gov2State.Confirming !== state) {
      return null;
    } else {
      return {
        percentage: confirmPercentage,
        start: confirmStartPercentage,
        length: confirmEndPercentage < 1 ? 1 : confirmEndPercentage,
        ...activeColorSettings,
        tooltipContent: confirmRemaining > 0 && (
          <Remaining blocks={confirmRemaining} />
        ),
      };
    }
  }, [
    confirmStart,
    confirmPercentage,
    confirmStartPercentage,
    confirmEndPercentage,
    confirmRemaining,
    state,
  ]);
}

function ConfirmMultiProgress() {
  const finishedItems = useFinishedConfirmationProgressItems();
  const ongoingItem = useOngoingConfirmationProgressItem();

  const progressItems = useMemo(() => {
    return [...finishedItems, ongoingItem].filter(Boolean);
  }, [finishedItems, ongoingItem]);

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

  if (gov2State.Rejected === state) {
    return <ConfirmMultiProgress />;
  } else if (!confirmStart) {
    return <Empty />;
  } else if (mode === zoomModes.out) {
    return <ConfirmMultiProgress />;
  } else {
    return <ConfirmSingleProgress />;
  }
}
