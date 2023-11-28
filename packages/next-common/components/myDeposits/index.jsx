import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { useChainSettings } from "next-common/context/chain";
import { useMyDepositDemocracy } from "./democracy";
import DepositTemplate from "./depositTemplate";
import { useMyDepositFellowship } from "./fellowship";
import MyDepositPreimages from "./preimages";
import { useMyDepositReferenda } from "./referenda";
import { useMyDepositTreasury } from "./treasury";

export default function MyDeposits() {
  const chainSettings = useChainSettings();
  const { hasReferenda, hasFellowship, hasTreasuryModule } = chainSettings;

  const referenda = useMyDepositReferenda();
  const fellowship = useMyDepositFellowship();
  const democracy = useMyDepositDemocracy();
  const treasury = useMyDepositTreasury();

  const activeItems = [];
  const nonActiveItems = [];
  if (hasReferenda) {
    (referenda.activeCount > 0 ? activeItems : nonActiveItems).push(referenda);
  }
  if (hasFellowship) {
    (fellowship.activeCount > 0 ? activeItems : nonActiveItems).push(
      fellowship,
    );
  }
  if (!chainSettings.noDemocracyModule) {
    (democracy.activeCount > 0 ? activeItems : nonActiveItems).push(democracy);
  }
  if (hasTreasuryModule !== false) {
    (treasury.activeCount > 0 ? activeItems : nonActiveItems).push(treasury);
  }
  const items = [...activeItems, ...nonActiveItems];

  return (
    <div className="space-y-6">
      <AccountSubTabs />

      <div className="space-y-6">
        {items.map((item) => (
          <DepositTemplate key={item.name} {...item} />
        ))}

        <MyDepositPreimages />
      </div>
    </div>
  );
}
