import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import sum from "lodash.sum";
import { useDepositTreasuryBountiesTab } from "./bounties";
import { useDepositTreasuryProposalsTab } from "./proposals";
import { useDepositTreasuryTipsTab } from "./tips";
import { useChainSettings } from "next-common/context/chain";

export function useMyDepositTreasury() {
  const proposals = useDepositTreasuryProposalsTab();
  const bounties = useDepositTreasuryBountiesTab();
  const tips = useDepositTreasuryTipsTab();
  const { hasTipsModule } = useChainSettings();

  let loading = proposals.loading || bounties.loading;
  let activeCount = sum([proposals.activeCount, bounties.activeCount]);
  if (hasTipsModule !== false) {
    activeCount += tips.activeCount;
    loading = loading || tips.loading;
  }

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  const items = [proposals, bounties, tips];
  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
