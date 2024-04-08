import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChainSettings } from "next-common/context/chain";
import WithPallet from "next-common/components/common/withPallet";
import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import CentrifugeStats from "./centrifugeStats";

export default function CentrifugeOverview() {
  const { showAccountManagementTab } = useChainSettings();

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <WithPallet pallet="treasury">
        <CentrifugeStats />
      </WithPallet>

      <WithPallet pallet="fellowshipSalary">
        <FellowshipSalaryOverview />
      </WithPallet>

      <div>
        <RecentProposals />
        {/* news */}
      </div>
    </div>
  );
}
