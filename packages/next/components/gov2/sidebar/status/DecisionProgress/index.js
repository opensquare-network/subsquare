import { useDecisionBlocks, useDecisionEnd } from "../useDecisionPercentage";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import { useSelector } from "react-redux";
import Progress from "next-common/components/progress";
import TimeDuration from "next-common/components/TimeDuration";
import {
  ProgressBarWrapper,
  ProgressGroup,
  ProgressInfo,
  Tooltip,
} from "../styled";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import Threshold from "next-common/components/referenda/threshold";
import { useDecision } from "next-common/context/post/gov2/track";
import { toPercentage } from "next-common/utils";
import DecisionTooltip from "./tooltip";

function OverDecisionMarker({ allBlocks, normalCaseBlocks }) {
  if (normalCaseBlocks >= allBlocks) {
    return null; // only show it when over decision
  }

  return (
    <Threshold
      thin={false}
      threshold={toPercentage(normalCaseBlocks / allBlocks, 2) + "%"}
      className={"h-[16px] !top-0"}
    />
  );
}

export default function DecisionProgress() {
  const latestHeight = useSelector(chainOrScanHeightSelector);

  const decisionBlocks = useDecisionBlocks();
  const period = useDecision();

  // const percentage = period / decisionBlocks; // todo:

  const decidingSince = useDecidingSince();
  const decisionEnd = useDecisionEnd();
  // const decisionRemaining = useDecisionRemaining();
  const normalCaseBlocks = useDecision();
  const allBlocks = useDecisionBlocks();

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

  const decisionTimePercentage =
    toPercentage(normalCaseBlocks / allBlocks, 2) || 100;

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip content={<DecisionTooltip />}>
          <Progress percentage={decisionPercentage}></Progress>
        </Tooltip>
        <OverDecisionMarker
          allBlocks={allBlocks}
          normalCaseBlocks={normalCaseBlocks}
        />
      </ProgressBarWrapper>

      <ProgressInfo>
        <span>Decision</span>
        <span
          className="absolute"
          style={{ right: `${100 - decisionTimePercentage}%` }}
        >
          <TimeDuration blocks={period} showMonths={false} />
        </span>
      </ProgressInfo>
    </ProgressGroup>
  );
}
