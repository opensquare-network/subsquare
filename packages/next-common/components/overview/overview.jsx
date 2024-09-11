import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChainSettings } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import MembersInduction from "./fellowship/membersInduction";
import CollectivesProvider from "next-common/context/collectives/collectives";
import AssetsTreasuryStats from "./assetsTreasuryStats";

export default function Overview() {
  const { showAccountManagementTab } = useChainSettings();
  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink={showAccountManagementTab === false} />

      <WithPallet pallet="fellowshipCore">
        <CollectivesProvider section="fellowship">
          <MembersInduction className="mt-4" />
        </CollectivesProvider>
      </WithPallet>

      <WithPallet pallet="treasury">
        <TreasuryStats />
        {/* TODO: only polkdot */}
        <AssetsTreasuryStats />
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
