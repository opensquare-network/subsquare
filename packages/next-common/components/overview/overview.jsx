import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChain, useChainSettings } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import Chains from "next-common/utils/consts/chains";
import CentrifugeStats from "./centrifugeStats";

export default function Overview() {
  const chain = useChain();
  const { showAccountManagementTab } = useChainSettings();
  const isCentrifuge = chain === Chains.centrifuge;

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <WithPallet pallet="treasury">
        {isCentrifuge ? <CentrifugeStats /> : <TreasuryStats />}
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
