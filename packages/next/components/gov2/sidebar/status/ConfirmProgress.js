import {
  ProgressGroup,
  ProgressInfo,
  ProgressInfoLabel,
  ProgressTooltipFailContent,
  Tooltip,
} from "./styled";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useConfirm } from "next-common/context/post/gov2/track";
import {
  calcConfirmStartPercentage,
  useConfirmStartPercentage,
  useConfirmEndPercentage,
  useConfirmRemaining,
} from "./useConfirmPercentage";
import Remaining from "./remaining";
import MultiProgress from "next-common/components/progress/multiProgress";
import { useMemo } from "react";
import {
  useConfirmingStarted,
  useConfirmTimelineFailPairs,
  useDecidingSince,
} from "next-common/context/post/gov2/referendum";
import isNil from "lodash.isnil";
import { useTheme } from "styled-components";
import TimeDuration from "next-common/components/TimeDuration";
import { useDecisionBlocks } from "./useDecisionPercentage";

function ConfirmationInfo() {
  const confirmPeriod = useConfirm();

  return (
    <ProgressInfo>
      <ProgressInfoLabel>Confirmation</ProgressInfoLabel>
      <p>
        <TimeDuration blocks={confirmPeriod} showMinutes={false} />
      </p>
    </ProgressInfo>
  );
}

function Empty() {
  const { grey100Bg } = useTheme();
  const confirmStart = useConfirmingStarted();
  if (confirmStart) {
    return null;
  }

  return (
    <ProgressGroup>
      <Tooltip content="Not started yet">
        <Progress percentage={0} bg={grey100Bg} />
      </Tooltip>
      <ConfirmationInfo />
    </ProgressGroup>
  );
}

function ConfirmationStarted() {
  const latestHeight = useSelector(latestHeightSelector);
  const { secondaryGreen500, secondaryGreen300, grey400Border } = useTheme();

  const confirmPeriod = useConfirm();
  const confirmRemaining = useConfirmRemaining();
  const confirmStart = useConfirmingStarted();
  const confirmStartPercentage = useConfirmStartPercentage();
  const confirmEndPercentage = useConfirmEndPercentage();
  const decisionBlocks = useDecisionBlocks();
  const decisionSince = useDecidingSince();

  const confirmFailPairs = useConfirmTimelineFailPairs();

  const confirmPercentage = useMemo(() => {
    if (isNil(latestHeight) || latestHeight <= confirmStart) {
      return 0;
    }

    const finishHeight = confirmStart + confirmPeriod;
    if (latestHeight >= finishHeight) {
      return 100;
    }

    const gone = latestHeight - confirmStart;
    return Number((gone / confirmPeriod) * 100).toFixed(2);
  }, [latestHeight, confirmStart, confirmPeriod]);

  if (isNil(confirmStart)) {
    return null;
  }

  const progressItems = useMemo(() => {
    const items = confirmFailPairs.map((pair) => {
      const [started, aborted] = pair ?? [];

      const startedHeight = started?.indexer?.blockHeight;
      const abortedHeight = aborted?.indexer?.blockHeight;

      const start = calcConfirmStartPercentage(
        decisionSince,
        decisionBlocks,
        startedHeight
      );
      const abortedHeightStart = calcConfirmStartPercentage(
        decisionSince,
        decisionBlocks,
        startedHeight + abortedHeight - startedHeight
      );

      const end = abortedHeightStart - start;

      return {
        percentage: 100,
        start,
        end: end < 1 ? 1 : end,
        fg: grey400Border,
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

    items.push({
      percentage: confirmPercentage,
      start: confirmStartPercentage,
      end: confirmEndPercentage < 1 ? 1 : confirmEndPercentage,
      fg: secondaryGreen500,
      bg: secondaryGreen300,
      tooltipContent: confirmRemaining > 0 && (
        <Remaining blocks={confirmRemaining} />
      ),
    });

    return items;
  }, [confirmPercentage]);

  return (
    <ProgressGroup>
      <MultiProgress progressItems={progressItems} />
      <ConfirmationInfo />
    </ProgressGroup>
  );
}

export default function ConfirmProgress() {
  const confirmStart = useConfirmingStarted();
  if (confirmStart) {
    return <ConfirmationStarted />;
  }

  return <Empty />;
}
