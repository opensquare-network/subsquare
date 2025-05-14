import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { useDecisionBlocks, useDecisionEnd } from "../useDecisionPercentage";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useDecision } from "next-common/context/post/gov2/track";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export default function DecisionTooltip() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const decidingSince = useDecidingSince();
  const decisionPeriod = useDecision();
  const decisionBlocks = useDecisionBlocks();
  const end = useDecisionEnd();
  const votingFinishedHeight = useReferendumVotingFinishHeight();
  const blockTime = useSelector(blockTimeSelector);

  const decisionPercentage = useMemo(() => {
    if (isNil(latestHeight)) {
      return 0;
    }
    if (latestHeight >= end) {
      return 100;
    }

    const gone = latestHeight - decidingSince;
    return Number((gone / decisionBlocks) * 100).toFixed(2);
  }, [latestHeight, decidingSince, decisionBlocks, end]);

  if (isNil(latestHeight)) {
    return null;
  }

  if (latestHeight >= end || latestHeight > votingFinishedHeight) {
    return `Total decision time ${formatTimeDuration(
      decisionBlocks * blockTime,
    )}`;
  }

  const timeOptions = { showMonths: false };
  const goneBlocks =
    latestHeight >= end ? decisionBlocks : latestHeight - decidingSince;
  const goneTime = formatTimeDuration(goneBlocks * blockTime, timeOptions);
  const leftBlocks = end - latestHeight;
  const leftTime = formatTimeDuration(blockTime * leftBlocks, timeOptions);
  if (decisionBlocks <= decisionPeriod) {
    return `${leftTime} remaining, ${decisionPercentage}%(${goneTime} has gone)`;
  }

  const maxDecisionTime = formatTimeDuration(
    decisionBlocks * blockTime,
    timeOptions,
  );
  const periodTime = formatTimeDuration(
    decisionPeriod * blockTime,
    timeOptions,
  );
  if (latestHeight - decidingSince <= decisionPeriod) {
    return `${leftTime} left in ${periodTime} decision period, max decision time is ${maxDecisionTime}`;
  } else {
    return `${goneTime} has gone, max decision time is ${maxDecisionTime}`;
  }
}
