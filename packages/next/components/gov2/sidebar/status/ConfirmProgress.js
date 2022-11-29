import {
  ProgressGroup,
  ProgressInfo,
  ProgressInfoLabel,
  Tooltip,
} from "./styled";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useConfirm } from "next-common/context/post/gov2/track";
import {
  calcConfirmOffsetLeftPercentage,
  calcConfirmOffsetRightPercentage,
  useConfirmOffsetLeftPercentage,
  useConfirmOffsetRightPercentage,
  useConfirmRemaining,
} from "./useConfirmPercentage";
import Remaining from "./remaining";
import Progress from "next-common/components/progress";
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
  const offsetLeft = useConfirmOffsetLeftPercentage();
  const offsetRight = useConfirmOffsetRightPercentage();
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

      const start = calcConfirmOffsetLeftPercentage(
        decisionSince,
        decisionBlocks,
        startedHeight
      );
      const end = calcConfirmOffsetRightPercentage(
        offsetLeft,
        abortedHeight,
        confirmPeriod
      );

      return {
        percentage: 100,
        start,
        end,
        fg: grey400Border,
        // TODO: duration
        tooltipContent: `Started: ${startedHeight?.toLocaleString?.()}`,
      };
    });

    items.push({
      percentage: confirmPercentage,
      start: offsetLeft,
      end: offsetRight,
      fg: secondaryGreen500,
      bg: secondaryGreen300,
    });

    return items;
  }, [confirmPercentage]);

  return (
    <ProgressGroup>
      <Tooltip
        content={
          confirmRemaining > 0 && <Remaining blocks={confirmRemaining} />
        }
      >
        <Progress progressItems={progressItems} />
      </Tooltip>
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
