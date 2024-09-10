import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useDecision } from "next-common/context/post/gov2/track";
import { useDecisionBlocks, useDecisionEnd } from "./useDecisionPercentage";
import { useApprovalThreshold } from "next-common/context/post/gov2/threshold";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { useDecimals } from "next-common/context/chain";

function WarningText() {
  const approvalThreshold = useApprovalThreshold();
  const tally = useReferendumTally();
  const decimals = useDecimals();
  let needNayVotes = BigNumber(tally.ayes).div(approvalThreshold).minus(tally.nays).minus(tally.nays).toString();
  if (BigNumber(needNayVotes).lt(0)) {
    needNayVotes = 0;
  }

  // fixme: normalize nay votes number
  return <div className="flex text14Medium text-orange500 bg-orange100 rounded-[8px] py-2.5 px-4">
    Will be rejected immediately with over {toPrecision(needNayVotes, decimals, 2)} nay votes.
  </div>;
}

export default function DecisionWarning() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const decidingSince = useDecidingSince();
  const decisionPeriod = useDecision();
  const decisionBlocks = useDecisionBlocks();
  const end = useDecisionEnd();

  if (
    decisionBlocks <= decisionPeriod ||
    latestHeight <= decidingSince + decisionPeriod ||
    latestHeight >= end
  ) {
    return null;
  }

  return <WarningText />;
}
