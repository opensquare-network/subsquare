import RecentProposals from "./recentProposals";
import { useChain } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
// import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import MembersInduction from "./fellowship/membersInduction";
import CollectivesProvider from "next-common/context/collectives/collectives";
import PolkadotTreasuryStats from "./polkadotTreasuryStats";
// import FellowshipTreasuryStats from "./fellowship/fellowshipTreasuryStats";
import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";
import KusamaTreasuryStats from "./kusamaTreasuryStats";
import dynamic from "next/dynamic";

const AccountInfo = dynamic(() => import("./accountInfo"), { ssr: false });
const FellowshipFinanceOverview = dynamic(
  () => import("./fellowship/finance"),
  { ssr: false },
);

const FellowshipApplicationGuide = dynamic(
  () => import("./fellowship/fellowshipApplicationGuide"),
  { ssr: false },
);

function ConditionTreasuryStats() {
  const chain = useChain();
  if (isPolkadotChain(chain)) {
    return <PolkadotTreasuryStats />;
  }

  if (isKusamaChain(chain)) {
    return <KusamaTreasuryStats />;
  }

  return <TreasuryStats />;
}

export default function Overview() {
  return (
    <div className="space-y-6">
      <AccountInfo />

      <WithPallet pallet="fellowshipCore">
        <CollectivesProvider section="fellowship">
          <MembersInduction className="mt-4" />
        </CollectivesProvider>
      </WithPallet>

      <WithPallet pallet="treasury">
        <ConditionTreasuryStats />
      </WithPallet>

      <FellowshipApplicationGuide />

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
