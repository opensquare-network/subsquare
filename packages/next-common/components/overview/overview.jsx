import RecentProposals from "./recentProposals";
import { useChain } from "next-common/context/chain";
import TreasuryStats from "./treasuryStats";
import WithPallet from "next-common/components/common/withPallet";
// import FellowshipSalaryOverview from "next-common/components/overview/fellowship/salary/overview";
import MembersInduction from "./fellowship/membersInduction";
import CollectivesProvider from "next-common/context/collectives/collectives";
import PolkadotTreasuryStats from "./polkadotTreasuryStats";
// import FellowshipTreasuryStats from "./fellowship/fellowshipTreasuryStats";
import {
  isPolkadotChain,
  isKusamaChain,
  isHydrationChain,
} from "next-common/utils/chain";
import KusamaTreasuryStats from "./kusamaTreasuryStats";
import dynamicClientOnly from "next-common/lib/dynamic/clientOnly";
import OnlyChain from "next-common/components/common/onlyChain";
import Chains from "next-common/utils/consts/chains";
import EcoNews from "./ecoNews";

const MultipleColumnCard = dynamicClientOnly(() =>
  import("./fellowship/multipleColumnCard"),
);

// Loaded on demand: it pulls in @galacticcouncil/sdk and the hydradx math .wasm files
// (~600KB), which would otherwise be part of the home page bundle on every chain.
const HydrationTreasuryStats = dynamicClientOnly(() =>
  import("./hydrationTreasuryStats"),
);

const AccountInfo = dynamicClientOnly(() => import("./accountInfo"));

function ConditionTreasuryStats() {
  const chain = useChain();
  if (isPolkadotChain(chain)) {
    return <PolkadotTreasuryStats />;
  }

  if (isKusamaChain(chain)) {
    return <KusamaTreasuryStats />;
  }

  if (isHydrationChain(chain)) {
    return <HydrationTreasuryStats />;
  }

  return <TreasuryStats />;
}

export default function Overview() {
  return (
    <div className="space-y-6">
      <AccountInfo />
      <EcoNews />

      <WithPallet pallet="fellowshipCore">
        <CollectivesProvider section="fellowship">
          <MembersInduction className="mt-4" />
        </CollectivesProvider>
      </WithPallet>

      <WithPallet pallet="treasury">
        <ConditionTreasuryStats />
      </WithPallet>

      <OnlyChain chain={Chains.collectives}>
        <MultipleColumnCard />
      </OnlyChain>

      {/* <WithPallet pallet="fellowshipSalary">
        <FellowshipSalaryOverview />
      </WithPallet>

      <WithPallet pallet="fellowshipTreasury">
        <FellowshipTreasuryStats />
      </WithPallet> */}

      <RecentProposals />
    </div>
  );
}
