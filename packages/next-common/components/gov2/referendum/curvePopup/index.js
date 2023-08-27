import styled from "styled-components";
import CurveIconOrigin from "../../../icons/curve";
import { useState } from "react";
import ThresholdCurvesGov2TallyPopup from "../../../charts/thresholdCurve/gov2TallyPopup";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "../../../../context/post/gov2/percentage";

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default function CurvePopup({
  tally = { tally },
  supportPerbill,
  isFellowship = false,
}) {
  const [showThresholdCurveDetailPopup, setShowThresholdCurveDetailPopup] =
    useState(false);

  const approvalPercentage = useApprovalPercentage(tally);
  const supportPercentage = useSupportPercentage(supportPerbill);

  return (
    <>
      <CurveIcon
        role="button"
        onClick={() => setShowThresholdCurveDetailPopup(true)}
      />

      {showThresholdCurveDetailPopup && (
        <ThresholdCurvesGov2TallyPopup
          setShow={setShowThresholdCurveDetailPopup}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
          isFellowship={isFellowship}
        />
      )}
    </>
  );
}
