import styled from "styled-components";
import CurveIconOrigin from "../../../icons/curve";
import { useState } from "react";
import ThresholdCurvesGov2TallyPopup from "../../../charts/thresholdCurve/gov2TallyPopup";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "../../../../context/post/gov2/percentage";
import useGov2ThresholdCurveData from "../../../../utils/hooks/useGov2ThresholdCurveData";
import BigNumber from "bignumber.js";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "next-common/store/reducers/chainSlice";
import last from "lodash.last";

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

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

function calcDataFromTallyHistory(
  tallyHistory,
  labels,
  decidingSince,
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
  const maxHeight = last(tallyHistory).indexer.blockHeight;

  let iterHeight = decidingSince;
  while (iterHeight <= maxHeight) {
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

  if (iterHeight < maxHeight + blockStep) {
    let { currentSupport, currentApprove } = calcFromOneTallyData(
      lastTally.tally,
    );
    currentSupportData.push(currentSupport);
    currentApprovalData.push(currentApprove);
  }

  return { currentSupportData, currentApprovalData };
}

export default function CurvePopup({
  track,
  tally,
  supportPerbill,
  tallyHistory,
}) {
  const approvalPercentage = useApprovalPercentage(tally);
  const { labels, supportData, approvalData } =
    useGov2ThresholdCurveData(track);
  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);
  const supportPercentage = useSupportPercentage(supportPerbill);
  const decidingSince = useDecidingSince();
  const blockTime = useSelector(blockTimeSelector);
  const latestHeight = useSelector(latestHeightSelector);

  const { currentSupportData, currentApprovalData } = calcDataFromTallyHistory(
    tallyHistory,
    labels,
    decidingSince,
    latestHeight,
    blockTime,
  );

  return (
    <>
      <CurveIcon
        role="button"
        onClick={() => setShowThresholdCurveDetailPopup(true)}
      />

      {showThresholdCurveDetailPopup && (
        <ThresholdCurvesGov2TallyPopup
          labels={labels}
          supportData={supportData}
          supportPerbill={supportPerbill}
          approvalData={approvalData}
          currentSupportData={currentSupportData}
          currentApprovalData={currentApprovalData}
          setShow={setShowThresholdCurveDetailPopup}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
        />
      )}
    </>
  );
}
