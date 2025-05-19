import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { last } from "lodash-es";
import BigNumber from "bignumber.js";
import useReferendumCurveData from "next-common/utils/hooks/referenda/detail/useReferendumCurveData";
import { useMemo } from "react";
import { useDecidingEndHeight } from "next-common/context/post/gov2/decidingPercentage";
import { referendaTallyHistorySelector } from "next-common/store/reducers/referenda/tallyHistory";
import { isEmpty } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";

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
  let historySupportData = [];
  let historyApprovalData = [];
  let historyAyesData = [];
  let historyNaysData = [];
  if (!tallyHistory || !decidingSince || isEmpty(tallyHistory)) {
    return {
      historySupportData,
      historyApprovalData,
      historyAyesData,
      historyNaysData,
    };
  }

  const oneHour = 3600 * 1000;
  const blockStep = oneHour / blockTime; // it means the blocks between 2 dots.
  let iterHeight = decidingSince;
  while (iterHeight <= decidingEnd) {
    const tally = tallyHistory.findLast(
      (tally) => tally.indexer.blockHeight <= iterHeight,
    );
    if (!tally) {
      break;
    }

    let { currentSupport, currentApprove } = calcFromOneTallyData(tally.tally);
    historySupportData.push(currentSupport);
    historyApprovalData.push(currentApprove);
    historyAyesData.push(tally.tally.ayes);
    historyNaysData.push(tally.tally.nays);
    iterHeight += blockStep;
  }

  if (iterHeight < decidingEnd + blockStep && latestHeight > decidingEnd) {
    const lastTally = last(tallyHistory);
    let { currentSupport, currentApprove } = calcFromOneTallyData(
      lastTally.tally,
    );
    historySupportData.push(currentSupport);
    historyApprovalData.push(currentApprove);
    historyAyesData.push(lastTally.tally.ayes);
    historyNaysData.push(lastTally.tally.nays);
  }

  return {
    historySupportData,
    historyApprovalData,
    historyAyesData,
    historyNaysData,
  };
}

export default function useHistoryTallyValueData() {
  const { labels } = useReferendumCurveData();
  const decidingSince = useDecidingSince();
  const blockTime = useSelector(blockTimeSelector);
  const tallyHistory = useSelector(referendaTallyHistorySelector);
  const decidingEndOrLatestHeight = useDecidingEndHeight();
  const latestHeight = useChainOrScanHeight();

  return useMemo(() => {
    return calcDataFromTallyHistory(
      tallyHistory,
      labels,
      decidingSince,
      decidingEndOrLatestHeight,
      latestHeight,
      blockTime,
    );
  }, [
    tallyHistory,
    labels,
    decidingSince,
    decidingEndOrLatestHeight,
    latestHeight,
    blockTime,
  ]);
}
