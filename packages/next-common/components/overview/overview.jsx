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
import TestFeeds from "next-common/components/scrollFeeds/testFeeds";

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

      <div className="flex gap-4 max-md:flex-col">
        <div className="flex-1">
          <TestFeeds />
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <div>
            <WithPallet pallet="fellowshipTreasury">
              <WithPallet pallet="fellowshipSalary">
                <FellowshipFinanceOverview />
              </WithPallet>
            </WithPallet>
          </div>

          <WithPallet pallet="fellowshipCore">
            <CollectivesProvider section="fellowship">
              <FellowshipApplicationGuide />
            </CollectivesProvider>
          </WithPallet>
        </div>
      </div>

      {/* <TestFeeds /> */}

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
