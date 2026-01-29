import CollectivesFellowshipCurveChartWithContext from "./collectivesFellowshipCurveChartWithContext";
import { FellowshipReferendaActionsProvider } from "../context/fellowshipReferendaActionsContext";
import ThresholdCurvesGov2TallyLegend from "../legend/gov2TallyLegend";
import { useState } from "react";
import AvatarSwitch from "../gov2TallyPopup/avatarSwitch";
import { FellowshipCurvePopupExpander } from "next-common/components/fellowship/referenda/curvePopup";

export default function DetailCurveChart() {
  const [showVoter, setShowVoter] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <FellowshipReferendaActionsProvider>
        <div className="flex items-center justify-between">
          <span className="text-textPrimary text14Bold">Threshold Curves</span>
          <div className="flex items-center gap-2">
            <AvatarSwitch value={showVoter} onChange={setShowVoter} />
            <FellowshipCurvePopupExpander />
          </div>
        </div>
        <CollectivesFellowshipCurveChartWithContext showVoter={showVoter} />
      </FellowshipReferendaActionsProvider>

      <ThresholdCurvesGov2TallyLegend showAyeNay={false} />
    </div>
  );
}
