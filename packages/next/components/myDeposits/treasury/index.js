import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import useFetchMyTreasuryDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits";
import { sum } from "lodash";
import { useDepositTreasuryBountiesTab } from "./bounties";
import { useDepositTreasuryProposalsTab } from "./proposals";
import { useDepositTreasuryTipsTab } from "./tips";

export function useDepositTreasury() {
  useFetchMyTreasuryDeposits();

  const proposals = useDepositTreasuryProposalsTab();
  const bounties = useDepositTreasuryBountiesTab();
  const tips = useDepositTreasuryTipsTab();

  const activeCount = sum([
    proposals.activeCount,
    bounties.activeCount,
    tips.activeCount,
  ]);

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  // TODO: exclude chains, ignore non-activeCount list?
  const items = [proposals, bounties, tips];

  return {
    ...menu,
    activeCount,
    items,
  };
}
