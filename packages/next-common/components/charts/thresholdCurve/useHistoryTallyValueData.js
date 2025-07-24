import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { last } from "lodash-es";
import BigNumber from "bignumber.js";
import { useMemo } from "react";
import { useDecidingEndHeight } from "next-common/context/post/gov2/decidingPercentage";
import { referendaTallyHistorySelector } from "next-common/store/reducers/referenda/tallyHistory";
import { isEmpty } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";

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
  preparingSince,
  decidingSince,
  decidingEnd,
  latestHeight,
  blockStep,
) {
  let historySupportData = [];
  let historyApprovalData = [];
  let historyAyesData = [];
  let historyNaysData = [];
  if (!tallyHistory || !preparingSince || isEmpty(tallyHistory)) {
    return {
      historySupportData,
      historyApprovalData,
      historyAyesData,
      historyNaysData,
    };
  }

  let iterHeight = preparingSince;
  while (iterHeight <= decidingEnd) {
    const tally = tallyHistory.findLast(
      (tally) => tally.indexer.blockHeight <= iterHeight,
    );
    if (!tally) {
      break;
    }

    let { currentSupport, currentApprove } = calcFromOneTallyData(tally.tally);
    if (decidingSince > iterHeight) {
      historySupportData.push(null);
      historyApprovalData.push(null);
    } else {
      historySupportData.push(currentSupport);
      historyApprovalData.push(currentApprove);
    }
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
  const decidingSince = useDecidingSince();
  const tallyHistory = useSelector(referendaTallyHistorySelector);
  const decidingEndOrLatestHeight = useDecidingEndHeight();
  const latestHeight = useChainOrScanHeight();
  const blockStep = useBlockSteps();
  const beginHeight = useBeginHeight();

  return useMemo(() => {
    return calcDataFromTallyHistory(
      tallyHistory,
      beginHeight,
      decidingSince,
      decidingEndOrLatestHeight,
      latestHeight,
      blockStep,
    );
  }, [
    tallyHistory,
    decidingSince,
    beginHeight,
    decidingEndOrLatestHeight,
    latestHeight,
    blockStep,
  ]);
}
