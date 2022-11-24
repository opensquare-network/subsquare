import { ProgressGroup, ProgressInfo, Tooltip } from "./styled";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useConfirm } from "next-common/context/post/gov2/track";
import {
  useConfirmOffsetLeftPercentage,
  useConfirmOffsetRightPercentage,
  useConfirmRemaining,
} from "./useConfirmPercentage";
import Remaining from "./remaining";
import Progress from "next-common/components/progress";
import { useMemo } from "react";
import { useConfirmingStarted } from "next-common/context/post/gov2/referendum";
import isNil from "lodash.isnil";
import { useTheme } from "styled-components";
import TimeDuration from "next-common/components/TimeDuration";

function ConfirmationInfo() {
  const confirmPeriod = useConfirm();

  return (
    <ProgressInfo>
      <p>Confirmation</p>
      <p>
        <TimeDuration blocks={confirmPeriod} showMinutes={false} />
      </p>
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
      <Tooltip content="Not started yet">
        <Progress percentage={0} />
      </Tooltip>
      <ConfirmationInfo />
    </ProgressGroup>
  );
}

function ConfirmationStarted() {
  const latestHeight = useSelector(latestHeightSelector);
  const { secondaryGreen500, secondaryGreen300 } = useTheme();

  const confirmPeriod = useConfirm();
  const confirmRemaining = useConfirmRemaining();
  const confirmStart = useConfirmingStarted();
  const offsetLeft = useConfirmOffsetLeftPercentage();
  const offsetRight = useConfirmOffsetRightPercentage();

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

  return (
    <ProgressGroup>
      <Tooltip
        content={
          confirmRemaining > 0 && <Remaining blocks={confirmRemaining} />
        }
      >
        <Progress
          percentage={confirmPercentage}
          offsetLeft={offsetLeft}
          offsetRight={offsetRight}
          fg={secondaryGreen500}
          bg={secondaryGreen300}
        />
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
