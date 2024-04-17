import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChainSettings } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import MembersInduction from "./membersInduction";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
export default function Overview() {
  const { showAccountManagementTab } = useChainSettings();
  const chain = useChain();
  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      {chain === Chains.collectives && <MembersInduction className="mt-4" />}

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
