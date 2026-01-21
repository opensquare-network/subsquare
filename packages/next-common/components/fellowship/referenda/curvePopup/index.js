import styled from "styled-components";
import CurveIconOrigin from "next-common/components/icons/curve";
import { useState } from "react";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "next-common/context/post/gov2/percentage";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useFellowshipReferendumTally } from "next-common/hooks/fellowship/useFellowshipReferendumInfo";
import useFellowshipPerbill from "next-common/utils/hooks/fellowship/useFellowshipPerbill";
import { ExpandIcon } from "next-common/components/gov2/referendum/curvePopup";

const ThresholdCurvesFellowshipTallyPopup = dynamicPopup(() =>
  import("next-common/components/charts/thresholdCurve/fellowshipTallyPopp"),
);

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export default function FellowshipCurvePopupOpener({
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
        <ThresholdCurvesFellowshipTallyPopup
          closeFunc={() => setShowThresholdCurveDetailPopup(false)}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
        />
      )}
    </>
  );
}

export function FellowshipCurvePopupExpander() {
  const [visible, setVisible] = useState(false);
  const tally = useFellowshipReferendumTally();
  const supportPerbill = useFellowshipPerbill();
  const approvalPercentage = useApprovalPercentage(tally);
  const supportPercentage = useSupportPercentage(supportPerbill);

  return (
    <>
      <button onClick={() => setVisible(true)}>
        <ExpandIcon />
      </button>
      {visible && (
        <ThresholdCurvesFellowshipTallyPopup
          closeFunc={() => setVisible(false)}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
        />
      )}
    </>
  );
}
