import Popup from "../../popup/wrapper/Popup";
import { noop } from "lodash-es";
import "../globalConfig";
import ThresholdCurvesGov2TallyLegend from "./legend/gov2TallyLegend";
import {
  useApprovalThreshold,
  useSupportThreshold,
} from "next-common/context/post/gov2/threshold";
import ThresholdSupportCard from "./thresholdCards/support";
import ThresholdApprovalCard from "./thresholdCards/approval";
import FellowshipCurveChart from "./fellowshipCurveChart";
import Flex from "next-common/components/styled/flex";
import HowOpenGovWorks from "next-common/components/howOpenGovWorks";
import ConfirmationEstimation from "./gov2TallyPopup/confirmationEstimation";
import { useState } from "react";
import AvatarSwitch from "./gov2TallyPopup/avatarSwitch";

export default function ThresholdCurvesFellowshipTallyPopup({
  closeFunc = noop,
  supportPerbill = 0,
  supportPercentage = 0,
  approvalPercentage = 0,
}) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();
  const [showVoter, setShowVoter] = useState(true);

  return (
    <Popup title="Threshold Curves" className="w-[960px]" onClose={closeFunc}>
      <div className="flex items-center justify-end mb-2">
        <AvatarSwitch value={showVoter} onChange={setShowVoter} />
      </div>
      <FellowshipCurveChart showVoter={showVoter} />
      <ThresholdCurvesGov2TallyLegend showAyeNay={false} />

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
      </Flex>

      <ConfirmationEstimation
        approvePercentage={approvalPercentage}
        supportPercentage={supportPercentage}
      />

      <div className="mt-[16px]">
        <HowOpenGovWorks anchor="referenda" />
      </div>
    </Popup>
  );
}
