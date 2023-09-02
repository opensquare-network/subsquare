import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "next-common/store/reducers/chainSlice";
import last from "lodash.last";
import BigNumber from "bignumber.js";
import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import { useMemo } from "react";
import { useDecidingEndHeight } from "next-common/context/post/gov2/decidingPercentage";
import { referendaTallyHistorySelector } from "next-common/store/reducers/referenda/tallyHistory";

function calcFromOneTallyData(tally) {
  const { ayes, nays, support, issuance } = tally;

  const currentSupport = new BigNumber(support).div(issuance).toNumber();
  const currentApprove = new BigNumber(ayes)
    .div(new BigNumber(ayes).plus(nays))
    .toNumber();

  return {
    currentSupport: (currentSupport || 0) * 100,
    currentApprove: (currentApprove || 0) * 100,
  };
}

export function calcDataFromTallyHistory(
  tallyHistory,
  labels,
  decidingSince,
  decidingEnd,
  latestHeight,
  blockTime,
) {
  let currentSupportData = null;
  let currentApprovalData = null;

  if (!tallyHistory || !decidingSince) {
    return { currentSupportData, currentApprovalData };
  }

  // We need to calculate the current support and approval data from tally history if it is provided
  currentSupportData = [];
  currentApprovalData = [];

  if (tallyHistory.length === 0) {
    return { currentSupportData, currentApprovalData };
  }

  const oneHour = 3600 * 1000;
  const blockStep = oneHour / blockTime; // it means the blocks between 2 dots.
  const lastTally = last(tallyHistory);

  let iterHeight = decidingSince;
  while (iterHeight <= decidingEnd) {
    const tally = tallyHistory.findLast(
      (tally) => tally.indexer.blockHeight <= iterHeight,
    );
    if (!tally) {
      break;
    }

    let { currentSupport, currentApprove } = calcFromOneTallyData(tally.tally);
    currentSupportData.push(currentSupport);
    currentApprovalData.push(currentApprove);
    iterHeight += blockStep;
  }

  if (iterHeight < decidingEnd + blockStep && latestHeight > decidingEnd) {
    let { currentSupport, currentApprove } = calcFromOneTallyData(
      lastTally.tally,
    );
    currentSupportData.push(currentSupport);
    currentApprovalData.push(currentApprove);
  }

  return { currentSupportData, currentApprovalData };
}

export default function useHistoryTallyValueData() {
  const { labels } = useReferendumCurveData();
  const decidingSince = useDecidingSince();
  const blockTime = useSelector(blockTimeSelector);
  const tallyHistory = useSelector(referendaTallyHistorySelector);
  const decidingEnd = useDecidingEndHeight();
  const latestHeight = useSelector(latestHeightSelector);

  return useMemo(() => {
    return calcDataFromTallyHistory(
      tallyHistory,
      labels,
      decidingSince,
      decidingEnd,
      latestHeight,
      blockTime,
    );
  }, [tallyHistory]);
}
