import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import useFetchMyTreasuryDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits";
import { sum } from "lodash";
import DepositTemplate from "./depositTemplate";
import { useDepositTreasuryBountiesTab } from "./treasury/bounties";
import { useDepositTreasuryProposalsTab } from "./treasury/proposals";
import { useDepositTreasuryTipsTab } from "./treasury/tips";

export default function MyTreasuryDeposits() {
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

  return <DepositTemplate {...menu} activeCount={activeCount} items={items} />;
}
