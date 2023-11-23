import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import useFetchMyTreasuryDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits";
import { sum } from "lodash";
import DepositTemplate from "./depositTemplate";
import { useDepositTreasuryBountiesTab } from "./treasury/bounties";
import { useDepositTreasuryProposalsTab } from "./treasury/proposals";
import { useDepositTreasuryTipsTab } from "./treasury/tips";

export default function MyTreasuryDeposits() {
  useFetchMyTreasuryDeposits();

  const depositTreasuryProposalsTab = useDepositTreasuryProposalsTab();
  const depositTreasuryBountiesTab = useDepositTreasuryBountiesTab();
  const depositTreasuryTipTab = useDepositTreasuryTipsTab();

  const activeCount = sum([
    depositTreasuryProposalsTab.activeCount,
    depositTreasuryBountiesTab.activeCount,
    depositTreasuryTipTab.activeCount,
  ]);

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  const items = [
    depositTreasuryProposalsTab,
    depositTreasuryBountiesTab,
    depositTreasuryTipTab,
  ];

  return (
    <div>
      <DepositTemplate {...menu} activeCount={activeCount} items={items} />
    </div>
  );
}
