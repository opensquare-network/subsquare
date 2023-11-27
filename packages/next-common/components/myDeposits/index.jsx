import AccountSubTabs from "next-common/components/overview/account/subTabs";
import { useChain, useChainSettings } from "next-common/context/chain";
import useFetchMyPreimageDeposits from "next-common/hooks/account/deposit/useFetchMyPreimageDeposits";
import { useMyDepositDemocracy } from "./democracy";
import DepositTemplate from "./depositTemplate";
import { useMyDepositFellowship } from "./fellowship";
import MyDepositPreimages from "./preimages";
import { useMyDepositReferenda } from "./referenda";
import { useMyDepositTreasury } from "./treasury";
import { isKintsugiChain } from "next-common/utils/chain";

export default function MyDeposits() {
  useFetchMyPreimageDeposits();

  const chain = useChain();
  const chainSettings = useChainSettings();
  const { hasReferenda, hasFellowship, hasTreasury } = chainSettings;
  const hasDemocracy =
    chainSettings.hasDemocracy !== false ||
    !chainSettings.noDemocracy ||
    !chainSettings.noDemocracyModule;

  const referenda = useMyDepositReferenda();
  const fellowship = useMyDepositFellowship();
  const democracy = useMyDepositDemocracy();
  const treasury = useMyDepositTreasury();

  const items = [
    hasReferenda && referenda,
    hasFellowship && fellowship,
    hasDemocracy && democracy,
    !isKintsugiChain(chain) && hasTreasury !== false && treasury,
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
