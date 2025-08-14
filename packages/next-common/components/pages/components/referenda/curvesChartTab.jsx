import { useState } from "react";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";
import AvatarSwitch from "next-common/components/charts/thresholdCurve/gov2TallyPopup/avatarSwitch";
import { CurvePopupExpander } from "next-common/components/gov2/referendum/curvePopup";
import ReferendaCurveChart from "next-common/components/charts/thresholdCurve/referendaCurveChart";

export default function CurvesChartTab() {
  const showVoteActions = useShowVoteActions();
  const [showVoter, setShowVoter] = useState(true);
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-textPrimary text14Bold">Threshold Curves</span>
        <div className="flex items-center gap-3">
          {showVoteActions && (
            <AvatarSwitch value={showVoter} onChange={setShowVoter} />
          )}
          <CurvePopupExpander />
        </div>
      </div>
      <ReferendaCurveChart showVoter={showVoter} />
    </>
  );
}
