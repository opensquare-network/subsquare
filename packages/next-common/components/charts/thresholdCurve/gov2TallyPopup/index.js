import { useState } from "react";
import Popup from "../../../popup/wrapper/Popup";
import { noop } from "lodash-es";
import "../../globalConfig";
import ThresholdCurvesGov2TallyLegend from "../legend/gov2TallyLegend";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "../../../../context/post/gov2/threshold";
import ThresholdSupportCard from "../thresholdCards/support";
import ThresholdApprovalCard from "../thresholdCards/approval";
import ReferendaCurveChart from "next-common/components/charts/thresholdCurve/referendaCurveChart";
import FellowshipCurveChart from "next-common/components/charts/thresholdCurve/fellowshipCurveChart";
import Flex from "next-common/components/styled/flex";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";
import ConfirmationEstimation from "next-common/components/charts/thresholdCurve/gov2TallyPopup/confirmationEstimation";
import ThresholdVotesCard from "../thresholdCards/votes";
import NayAyeSwitch from "./nayAyeSwitch";
import VoteActionsList from "./voteActionsList";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";
import { cn } from "next-common/utils";

function PopupChartContent({ isFellowship = false, showAyeNay }) {
  if (isFellowship) {
    return <FellowshipCurveChart />;
  } else {
    return <ReferendaCurveChart showAyeNay={showAyeNay} />;
  }
}

export default function ThresholdCurvesGov2TallyPopup({
  closeFunc = noop,
  supportPerbill = 0,
  supportPercentage = 0,
  approvalPercentage = 0,
  isFellowship = false,
}) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();
  const [showAyeNay, setShowAyeNay] = useState(true);
  const showVoteActions = useShowVoteActions();

  return (
    <Popup
      title="Threshold Curves"
      className={cn("w-[960px]", showVoteActions && "my-[4vh]")}
      onClose={closeFunc}
      extra={
        !isFellowship && (
          <NayAyeSwitch isOn={showAyeNay} setIsOn={setShowAyeNay} />
        )
      }
    >
      <PopupChartContent isFellowship={isFellowship} showAyeNay={showAyeNay} />
      <ThresholdCurvesGov2TallyLegend
        isFellowship={isFellowship}
        showAyeNay={showAyeNay}
      />

      <Flex className="flex max-sm:flex-col grow gap-[16px]">
        <ThresholdApprovalCard
          approvalThreshold={approvalThreshold}
          approvalPercentage={approvalPercentage}
        />

        <ThresholdSupportCard
          supportThreshold={supportThreshold}
          supportPerbill={supportPerbill}
          supportPercentage={supportPercentage}
        />

        {!isFellowship && <ThresholdVotesCard />}
      </Flex>

      <ConfirmationEstimation
        approvePercentage={approvalPercentage}
        supportPercentage={supportPercentage}
      />

      {!isFellowship && showVoteActions && <VoteActionsList />}

      <div className="mt-[16px]">
        <HowOpenGovWorks anchor="referenda" />
      </div>
    </Popup>
  );
}
