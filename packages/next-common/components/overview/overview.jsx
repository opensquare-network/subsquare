import AccountInfo from "./accountInfo";
import ActiveProposals from "./activeProposals";
import { useChainSettings } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
import FellowshipSalaryStats from "next-common/components/overview/fellowship/salary/stats";

export default function Overview() {
  const { showAccountManagementTab } = useChainSettings();

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <WithPallet pallet="treasury">
        <TreasuryStats />
      </WithPallet>

      <WithPallet pallet="fellowshipSalary">
        <FellowshipSalaryStats />
      </WithPallet>

      <div>
        <ActiveProposals />
        {/* news */}
      </div>
    </div>
  );
}
