import AccountInfo from "./accountInfo";
import RecentProposals from "./recentProposals";
import { useChain } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
// import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import MembersInduction from "./fellowship/membersInduction";
import CollectivesProvider from "next-common/context/collectives/collectives";
import PolkadotTreasuryStats from "./polkadotTreasuryStats";
// import FellowshipTreasuryStats from "./fellowship/fellowshipTreasuryStats";
import { isPolkadotChain } from "next-common/utils/chain";
import FellowshipFinanceOverview from "./fellowship/finance";

export default function Overview() {
  const chain = useChain();

  return (
    <div className="space-y-6">
      <AccountInfo />

      <WithPallet pallet="fellowshipCore">
        <CollectivesProvider section="fellowship">
          <MembersInduction className="mt-4" />
        </CollectivesProvider>
      </WithPallet>

      <WithPallet pallet="treasury">
        {isPolkadotChain(chain) ? <PolkadotTreasuryStats /> : <TreasuryStats />}
      </WithPallet>

      <WithPallet pallet="fellowshipTreasury">
        <WithPallet pallet="fellowshipSalary">
          <FellowshipFinanceOverview />
        </WithPallet>
      </WithPallet>

      {/* <WithPallet pallet="fellowshipSalary">
        <FellowshipSalaryOverview />
      </WithPallet>

      <WithPallet pallet="fellowshipTreasury">
        <FellowshipTreasuryStats />
      </WithPallet> */}

      <div>
        <RecentProposals />
        {/* news */}
      </div>
    </div>
  );
}
