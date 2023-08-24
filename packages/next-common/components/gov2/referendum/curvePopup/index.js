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

function calcDataFromTallyHistory(tallyHistory, labels) {
  let currentSupportData = null;
  let currentApprovalData = null;

  if (!tallyHistory) {
    return { currentSupportData, currentApprovalData };
  }

  // We need to calculate the current support and approval data from tally history if it is provided
  currentSupportData = [];
  currentApprovalData = [];

  if (tallyHistory.length === 0) {
    return { currentSupportData, currentApprovalData };
  }

  const firstDataPointTime = tallyHistory[0].indexer.blockTime;
  let { currentSupport, currentApprove } = calcFromOneTallyData(
    tallyHistory[0].tally,
  );

  currentSupportData.push(currentSupport);
  currentApprovalData.push(currentApprove);

  let currentPointNum = 0;

  // Loop through tally history to find nearest data point for each hour
  for (let i = 1; i < tallyHistory.length; i++) {
    const nextDataPointTime =
      firstDataPointTime + (currentPointNum + 1) * 3600 * 1000;
    if (tallyHistory[i].indexer.blockTime > nextDataPointTime) {
      ({ currentSupport, currentApprove } = calcFromOneTallyData(
        tallyHistory[i - 1].tally,
      ));

      currentSupportData.push(currentSupport);
      currentApprovalData.push(currentApprove);

      currentPointNum++;
    }
  }

  // Fill the rest of the data points with the last data point
  for (let i = currentPointNum + 1; i < labels.length; i++) {
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

  const { currentSupportData, currentApprovalData } = calcDataFromTallyHistory(
    tallyHistory,
    labels,
  );

  console.log({
    currentSupportData,
    currentApprovalData,
  });

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
