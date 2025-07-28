import styled from "styled-components";
import CurveIconOrigin from "next-common/components/icons/curve";
import { useState } from "react";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "next-common/context/post/gov2/percentage";
import dynamicPopup from "next-common/lib/dynamic/popup";

const FellowshipThresholdCurvesGov2TallyPopup = dynamicPopup(() =>
  import(
    "next-common/components/charts/thresholdCurve/gov2TallyPopup/fellowship"
  ),
);

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default function FwllowshipCurvePopupOpener({
  tally = { tally },
  supportPerbill,
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
        <FellowshipThresholdCurvesGov2TallyPopup
          closeFunc={() => setShowThresholdCurveDetailPopup(false)}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
        />
      )}
    </>
  );
}
