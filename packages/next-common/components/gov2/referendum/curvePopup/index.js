import styled from "styled-components";
import CurveIconOrigin from "../../../icons/curve";
import {
  useApprovalPercentage,
  useSupportPercentage,
} from "../../../../context/post/gov2/percentage";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  useThresholdCurvesVisible,
  setPopupVisible,
} from "next-common/store/reducers/referenda/thresholdCurves";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";
import useSupportPerbill from "next-common/utils/gov2/tally/useSupportPerbill";
import { useDispatch } from "react-redux";
import { SystemExpand } from "@osn/icons/subsquare";

const ThresholdCurvesGov2TallyPopup = dynamicPopup(() =>
  import("next-common/components/charts/thresholdCurve/gov2TallyPopup"),
);

const CurveIcon = styled(CurveIconOrigin)`
  cursor: pointer;

  &:hover {
    path {
      stroke: var(--textSecondary);
    }
  }
`;

export const ExpandIcon = styled(SystemExpand)`
  cursor: pointer;
  width: 16px;
  height: 16px;
  color: var(--textSecondary);

  &:hover {
    color: var(--textPrimary);
  }
`;

export function CurvePopupOpener() {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(setPopupVisible(true))}>
      <CurveIcon />
    </button>
  );
}

export function CurvePopupExpander() {
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(setPopupVisible(true))}>
      <ExpandIcon />
    </button>
  );
}

export default function CurvePopup() {
  const dispatch = useDispatch();
  const visible = useThresholdCurvesVisible();
  const tally = useReferendumTally();
  const supportPerbill = useSupportPerbill(tally);
  const approvalPercentage = useApprovalPercentage(tally);
  const supportPercentage = useSupportPercentage(supportPerbill);

  const closeFunc = () => {
    dispatch(setPopupVisible(false));
  };

  return (
    <>
      {visible && (
        <ThresholdCurvesGov2TallyPopup
          closeFunc={closeFunc}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
          approvalPercentage={approvalPercentage}
        />
      )}
    </>
  );
}
