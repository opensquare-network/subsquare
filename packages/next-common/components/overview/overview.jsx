import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChainSettings } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import MembersInduction from "./fellowship/membersInduction";

export default function Overview() {
  const { showAccountManagementTab } = useChainSettings();
  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <WithPallet pallet="fellowshipCore">
        <MembersInduction className="mt-4" />
      </WithPallet>

      <WithPallet pallet="treasury">
        <TreasuryStats />
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
