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
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import EcoNews from "./ecoNews";

const AccountInfo = dynamicClientOnly(() => import("./accountInfo"));
const FellowshipFinanceOverview = dynamicClientOnly(() =>
  import("./fellowship/finance"),
);
const FellowshipApplicationGuide = dynamicClientOnly(() =>
  import("./fellowship/fellowshipApplicationGuide"),
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

      <WithPallet pallet="fellowshipTreasury">
        <WithPallet pallet="fellowshipSalary">
          <FellowshipFinanceOverview />
        </WithPallet>
      </WithPallet>

      <WithPallet pallet="fellowshipCore">
        <CollectivesProvider section="fellowship">
          <FellowshipApplicationGuide />
        </CollectivesProvider>
      </WithPallet>

      {/* <WithPallet pallet="fellowshipSalary">
        <FellowshipSalaryOverview />
      </WithPallet>

      <WithPallet pallet="fellowshipTreasury">
        <FellowshipTreasuryStats />
      </WithPallet> */}

      <div className="flex gap-6 flex-col md:flex-row">
        <div className="overflow-hidden w-full">
          <RecentProposals />
        </div>
        <EcoNews />
      </div>
    </div>
  );
}
