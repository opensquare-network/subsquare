import { last } from "lodash-es";
import BigNumber from "bignumber.js";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import { useMemo } from "react";
import { useReferendaTallyHistory } from "next-common/store/reducers/referenda/thresholdCurves";
import { isEmpty } from "lodash-es";
import useLatestBlockTime from "next-common/utils/hooks/useBlockTime";
import useDecisionStartedTime from "next-common/utils/hooks/referenda/detail/useDecisionStartedTime";
import useChainOrScanHeight from "next-common/hooks/height";
import { useChainSettings } from "next-common/context/chain";

const oneHour = 3600 * 1000;

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
      ) ||
      last(tallyHistory);

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

export function calcDataFromTallyHistoryByTime(
  tallyHistory,
  startedTime,
  latestTime,
  rangeEndTime,
) {
  let historySupportData = [];
  let historyApprovalData = [];
  let historyAyesData = [];
  let historyNaysData = [];
  if (!tallyHistory || !startedTime || !latestTime || isEmpty(tallyHistory)) {
    return {
      historySupportData,
      historyApprovalData,
      historyAyesData,
      historyNaysData,
    };
  }

  const endTime = Math.min(latestTime, rangeEndTime);

  let iterTime = startedTime;
  while (iterTime <= endTime) {
    const tally =
      tallyHistory.findLast((item) => item.indexer.blockTime <= iterTime) ||
      last(tallyHistory);

    let { currentSupport, currentApprove } = calcFromOneTallyData(tally.tally);
    historySupportData.push(currentSupport);
    historyApprovalData.push(currentApprove);
    historyAyesData.push(tally.tally.ayes);
    historyNaysData.push(tally.tally.nays);
    iterTime += oneHour;
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
  const latestTime = useLatestBlockTime();
  const blockStep = useBlockSteps();
  const beginHeight = useBeginHeight();
  const startedTime = useDecisionStartedTime();
  const { assethubMigration } = useChainSettings();
  const useTimeAxis = assethubMigration?.migrated;
  const rangeEndHeight = beginHeight + blockStep * totalHours;
  const rangeEndTime = startedTime + totalHours * oneHour;

  return useMemo(() => {
    if (useTimeAxis) {
      return calcDataFromTallyHistoryByTime(
        tallyHistory,
        startedTime,
        latestTime,
        rangeEndTime,
      );
    }

    return calcDataFromTallyHistory(
      tallyHistory,
      beginHeight,
      latestHeight,
      blockStep,
      rangeEndHeight,
    );
  }, [
    useTimeAxis,
    tallyHistory,
    startedTime,
    latestTime,
    rangeEndTime,
    beginHeight,
    latestHeight,
    blockStep,
    rangeEndHeight,
  ]);
}
