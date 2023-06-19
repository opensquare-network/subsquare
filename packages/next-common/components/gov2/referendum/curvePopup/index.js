import styled from "styled-components";
import CurveIconOrigin from "../../../icons/curve";
import { useState } from "react";
import ThresholdCurvesGov2TallyPopup from "../../../charts/thresholdCurve/gov2TallyPopup";
import { useApprovalPercentage, useSupportPercentage } from "../../../../context/post/gov2/percentage";
import useGov2ThresholdCurveData from "../../../../utils/hooks/useGov2ThresholdCurveData";

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default function CurvePopup({ track, tally, supportPerbill }) {
  const approvalPercentage = useApprovalPercentage(tally);
  const { labels, supportData, approvalData } = useGov2ThresholdCurveData(track);
  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] = useState(false);
  const supportPercentage = useSupportPercentage(supportPerbill);

  return <>
    <CurveIcon role="button" onClick={() => setShowThresholdCurveDetailPopup(true)} />

    {showThresholdCurveDetailPopup && (
      <ThresholdCurvesGov2TallyPopup
        labels={labels}
        supportData={supportData}
        supportPerbill={supportPerbill}
        approvalData={approvalData}
        setShow={setShowThresholdCurveDetailPopup}
        supportPercentage={supportPercentage}
        approvalPercentage={approvalPercentage}
      />
    )}
  </>;
}
