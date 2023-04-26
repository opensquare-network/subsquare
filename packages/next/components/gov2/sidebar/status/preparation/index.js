import { useSubmittedAt } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { usePreparation } from "next-common/context/post/gov2/track";
import { useEffect, useState } from "react";
import isNil from "lodash.isnil";
import { ProgressBarWrapper, ProgressGroup, ProgressInfo, Tooltip } from "../styled";
import Progress from "next-common/components/progress";
import { usePrepareRemaining } from "./remaining";
import Remaining from "../remaining";
import TimeDuration from "next-common/components/TimeDuration";

export default function PreparationProgress() {
  const latestHeight = useSelector(latestHeightSelector);
  const submittedAt = useSubmittedAt();
  const prepareBlocks = usePreparation();
  const remaining = usePrepareRemaining();

  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    if (isNil(latestHeight)) {
      return setPercentage(0);
    }

    if (latestHeight >= submittedAt + prepareBlocks) {
      return setPercentage(100);
    }

    const gone = latestHeight - submittedAt;
    setPercentage(Number((gone / prepareBlocks) * 100).toFixed(2));
  }, [submittedAt, latestHeight, prepareBlocks]);

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip
          content={
            remaining > 0 && <Remaining blocks={remaining} />
          }
        >
          <Progress percentage={percentage} />
        </Tooltip>
      </ProgressBarWrapper>

      <ProgressInfo>
        <span>Prepare Period</span>
        <span>
          <TimeDuration blocks={prepareBlocks} />
        </span>
      </ProgressInfo>
    </ProgressGroup>
  );
}
