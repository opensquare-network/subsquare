import { useSelector } from "react-redux";
import { last } from "lodash-es";
import BigNumber from "bignumber.js";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
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
  beginHeight,
  decidingEnd,
  latestHeight,
  blockStep,
) {
  let historySupportData = [];
  let historyApprovalData = [];
  let historyAyesData = [];
  let historyNaysData = [];
  if (!tallyHistory || !beginHeight || isEmpty(tallyHistory)) {
    return {
      historySupportData,
      historyApprovalData,
      historyAyesData,
      historyNaysData,
    };
  }

  let iterHeight = beginHeight;
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
  const tallyHistory = useSelector(referendaTallyHistorySelector);
  const decidingEndOrLatestHeight = useDecidingEndHeight();
  const latestHeight = useChainOrScanHeight();
  const blockStep = useBlockSteps();
  const beginHeight = useBeginHeight();

  return useMemo(() => {
    return calcDataFromTallyHistory(
      tallyHistory,
      beginHeight,
      decidingEndOrLatestHeight,
      latestHeight,
      blockStep,
    );
  }, [
    tallyHistory,
    beginHeight,
    decidingEndOrLatestHeight,
    latestHeight,
    blockStep,
  ]);
}
