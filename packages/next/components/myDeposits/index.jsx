import { AccountSubTabs } from "components/overview/account/subTabs";
import { useChainSettings } from "next-common/context/chain";
import { useDepositDemocracy } from "./democracy";
import DepositTemplate from "./depositTemplate";
import { useDepositFellowship } from "./fellowship";
import { useDepositReferenda } from "./referenda";
import { useDepositTreasury } from "./treasury";

export default function MyDeposits() {
  const { hasReferenda, hasFellowship } = useChainSettings();

  const referenda = useDepositReferenda();
  const fellowship = useDepositFellowship();
  const democracy = useDepositDemocracy();
  const treasury = useDepositTreasury();

  const items = [
    hasReferenda && referenda,
    hasFellowship && fellowship,
    democracy,
    treasury,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <AccountSubTabs />

      <div className="space-y-6">
        {items.map((item) => (
          <DepositTemplate key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
