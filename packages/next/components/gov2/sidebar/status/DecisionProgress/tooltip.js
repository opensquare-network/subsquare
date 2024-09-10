import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { useDecisionBlocks, useDecisionEnd } from "../useDecisionPercentage";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useDecision } from "next-common/context/post/gov2/track";
import { useMemo } from "react";
import { isNil } from "lodash-es";

export default function DecisionTooltip() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const decidingSince = useDecidingSince();
  const decisionPeriod = useDecision();
  const decisionBlocks = useDecisionBlocks();
  const end = useDecisionEnd();
  const blockTime = useSelector(blockTimeSelector);

  const goneBlocks = latestHeight >= end ? decisionBlocks : latestHeight - decidingSince;
  const goneTime = formatTimeDuration(goneBlocks);

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

  if (decisionBlocks <= decisionPeriod && latestHeight < end) {
    const leftBlocks = end - latestHeight;
    const leftTime = formatTimeDuration(blockTime * leftBlocks);
    return `${goneTime} gone, ${decisionPercentage}%, ${leftTime} remaining`;
  } else if (latestHeight >= end) {
    return `Total decision time ${formatTimeDuration(decisionBlocks * blockTime)}`;
  }
}
