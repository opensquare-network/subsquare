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
import calcPerbill from "next-common/utils/math/calcPerbill";

export function calcFromFellowshipTallyData(tally) {
  const { ayes, nays, bareAyes, maxVoters } = tally;

  const supportPerbill = calcPerbill(bareAyes || 0, maxVoters || 0);
  const currentSupport = new BigNumber(supportPerbill)
    .div(Math.pow(10, 9))
    .toNumber();

  const ayesBN = new BigNumber(ayes || 0);
  const naysBN = new BigNumber(nays || 0);
  const total = ayesBN.plus(naysBN);
  const currentApprove = total.gt(0) ? ayesBN.div(total).toNumber() : 0;

  return {
    currentSupport: (currentSupport || 0) * 100,
    currentApprove: (currentApprove || 0) * 100,
  };
}

export function calcDataFromFellowshipTallyHistory(
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
    const tallyItem =
      tallyHistory.findLast((item) => item.indexer.blockHeight <= iterHeight) ||
      last(tallyHistory);

    if (tallyItem && tallyItem.tally) {
      let { currentSupport, currentApprove } = calcFromFellowshipTallyData(
        tallyItem.tally,
      );
      historySupportData.push(currentSupport);
      historyApprovalData.push(currentApprove);
      historyAyesData.push(tallyItem.tally.ayes);
      historyNaysData.push(tallyItem.tally.nays);
    }
    iterHeight += blockStep;
  }

  return {
    historySupportData,
    historyApprovalData,
    historyAyesData,
    historyNaysData,
  };
}

export function useFellowshipHistoryTallyValueData(totalHours) {
  const tallyHistory = useReferendaTallyHistory();
  const latestHeight = useChainOrScanHeight();
  const blockStep = useBlockSteps();
  const beginHeight = useBeginHeight();
  const rangeEndHeight = beginHeight + blockStep * totalHours;

  return useMemo(() => {
    return calcDataFromFellowshipTallyHistory(
      tallyHistory,
      beginHeight,
      latestHeight,
      blockStep,
      rangeEndHeight,
    );
  }, [tallyHistory, beginHeight, latestHeight, blockStep, rangeEndHeight]);
}
