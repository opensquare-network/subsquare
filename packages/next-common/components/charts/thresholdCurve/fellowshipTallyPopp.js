import Popup from "../../popup/wrapper/Popup";
import { noop } from "lodash-es";
import "../globalConfig";
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
import useVoteSearch from "next-common/components/pages/components/fellowship/referendum/sidebar/tally/voteActions/useVoteSearch";
import VoteActionsTable from "next-common/components/pages/components/fellowship/referendum/sidebar/tally/voteActions/table";
export default function ThresholdCurvesFellowshipTallyPopup({
  closeFunc = noop,
  supportPerbill = 0,
  supportPercentage = 0,
  approvalPercentage = 0,
}) {
  const approvalThreshold = useApprovalThreshold();
  const supportThreshold = useSupportThreshold();
  const { search, searchBtn, searchBar } = useVoteSearch();

  return (
    <Popup title="Threshold Curves" className="w-[960px]" onClose={closeFunc}>
      <FellowshipCurveChart />

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

      <div>
        <div className="flex justify-between text-textPrimary text14Bold pb-4">
          <span>Actions</span> {searchBtn}
        </div>

        {searchBar}
        <VoteActionsTable listHeight={300} search={search} />
      </div>
    </Popup>
  );
}
