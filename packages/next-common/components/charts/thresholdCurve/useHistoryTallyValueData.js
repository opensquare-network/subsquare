import { last } from "lodash-es";
import BigNumber from "bignumber.js";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo } from "react";
import { useReferendaTallyHistory } from "next-common/store/reducers/referenda/thresholdCurves";
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
  latestHeight,
  blockStep,
  rangeEndHeight,
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

  const endHeight = Math.min(latestHeight, rangeEndHeight);

  let iterHeight = beginHeight;
  while (iterHeight <= endHeight) {
    const tally =
      tallyHistory.findLast(
        (tally) => tally.indexer.blockHeight <= iterHeight,
      ) || last(tallyHistory);

    let { currentSupport, currentApprove } = calcFromOneTallyData(tally.tally);
    historySupportData.push(currentSupport);
    historyApprovalData.push(currentApprove);
    historyAyesData.push(tally.tally.ayes);
    historyNaysData.push(tally.tally.nays);
    iterHeight += blockStep;
  }

  return {
    historySupportData,
    historyApprovalData,
    historyAyesData,
    historyNaysData,
  };
}

export default function useHistoryTallyValueData(totalHours) {
  const tallyHistory = useReferendaTallyHistory();
  const latestHeight = useChainOrScanHeight();
  const blockStep = useBlockSteps();
  const beginHeight = useBeginHeight();
  const rangeEndHeight = beginHeight + blockStep * totalHours;

  return useMemo(() => {
    return calcDataFromTallyHistory(
      tallyHistory,
      beginHeight,
      latestHeight,
      blockStep,
      rangeEndHeight,
    );
  }, [tallyHistory, beginHeight, latestHeight, blockStep, rangeEndHeight]);
}
