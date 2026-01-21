import { useReferendumVotingFinishIndexer } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { MigrationConditionalApiProvider } from "next-common/context/migration/conditionalApi";
import CollectivesFellowshipCurveChartWithContext from "./collectivesFellowshipCurveChartWithContext";
import { FellowshipReferendaActionsProvider } from "../context/fellowshipReferendaActionsContext";
import ThresholdCurvesGov2TallyLegend from "../legend/gov2TallyLegend";
import { useState } from "react";
import AvatarSwitch from "../gov2TallyPopup/avatarSwitch";
import { FellowshipCurvePopupExpander } from "next-common/components/fellowship/referenda/curvePopup";

export default function DetailCurveChart() {
  const indexer = useReferendumVotingFinishIndexer();
  const [showVoter, setShowVoter] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <MigrationConditionalApiProvider indexer={indexer}>
        <FellowshipReferendaActionsProvider>
          <div className="flex items-center justify-between">
            <span className="text-textPrimary text14Bold">
              Threshold Curves
            </span>
            <div className="flex items-center gap-2">
              <AvatarSwitch value={showVoter} onChange={setShowVoter} />
              <FellowshipCurvePopupExpander />
            </div>
          </div>
          <CollectivesFellowshipCurveChartWithContext showVoter={showVoter} />
        </FellowshipReferendaActionsProvider>
      </MigrationConditionalApiProvider>

      <ThresholdCurvesGov2TallyLegend showAyeNay={false} />
    </div>
  );
}
