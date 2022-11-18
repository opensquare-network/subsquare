import {
  useDecisionBlocks,
  useDecisionEnd,
  useDecisionRemaining,
} from "./useDecisionPercentage";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import Remaining from "./remaining";
import Progress from "next-common/components/progress";
import TimeDuration from "next-common/components/TimeDuration";
import { ProgressGroup, ProgressInfo, Tooltip } from "./styled";

export default function DecisionProgress() {
  const latestHeight = useSelector(latestHeightSelector);

  const decisionBlocks = useDecisionBlocks();
  const decidingSince = useDecidingSince();
  const decisionEnd = useDecisionEnd();
  const decisionRemaining = useDecisionRemaining();

  const decisionPercentage = useMemo(() => {
    if (isNil(latestHeight)) {
      return 0;
    }
    if (latestHeight >= decisionEnd) {
      return 100;
    }

    const gone = latestHeight - decidingSince;
    return Number((gone / decisionBlocks) * 100).toFixed(2);
  }, [latestHeight, decidingSince, decisionBlocks, decisionEnd]);

  return (
    <ProgressGroup>
      <Tooltip
        content={
          decisionRemaining > 0 && <Remaining blocks={decisionRemaining} />
        }
      >
        <Progress percentage={decisionPercentage} />
      </Tooltip>
      <ProgressInfo>
        <p>Decision Period</p>
        <p>
          <TimeDuration
            blocks={decisionBlocks}
            showHours={false}
            showMinutes={false}
          />
        </p>
      </ProgressInfo>
    </ProgressGroup>
  );
}
