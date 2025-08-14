import { useState } from "react";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";
import AvatarSwitch from "next-common/components/charts/thresholdCurve/gov2TallyPopup/avatarSwitch";
import { CurvePopupExpander } from "next-common/components/gov2/referendum/curvePopup";
import ReferendaCurveChart from "next-common/components/charts/thresholdCurve/referendaCurveChart";

export default function CurvesChartTab() {
  const [showVoter, setShowVoter] = useState(true);
  return (
    <>
      <Header showVoter={showVoter} setShowVoter={setShowVoter} />
      <ReferendaCurveChart showVoter={showVoter} />
    </>
  );
}

function Header({ showVoter, setShowVoter }) {
  const showVoteActions = useShowVoteActions();

  return (
    <div className="flex items-center justify-between">
      <span className="text-textPrimary text14Bold">Threshold Curves</span>
      <div className="flex items-center gap-3">
        {showVoteActions && (
          <AvatarSwitch value={showVoter} onChange={setShowVoter} />
        )}
        <CurvePopupExpander />
      </div>
    </div>
  );
}
