import { AccountSubTabs } from "components/overview/account/subTabs";
import { useChainSettings } from "next-common/context/chain";
import { useMyDepositDemocracy } from "./democracy";
import DepositTemplate from "./depositTemplate";
import { useMyDepositFellowship } from "./fellowship";
import MyDepositPreimages from "./preimages";
import { useMyDepositReferenda } from "./referenda";
import { useMyDepositTreasury } from "./treasury";

export default function MyDeposits() {
  const { hasReferenda, hasFellowship } = useChainSettings();

  const referenda = useMyDepositReferenda();
  const fellowship = useMyDepositFellowship();
  const democracy = useMyDepositDemocracy();
  const treasury = useMyDepositTreasury();

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

        <MyDepositPreimages />
      </div>
    </div>
  );
}
