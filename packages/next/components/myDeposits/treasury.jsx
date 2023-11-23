import ActiveProposalTemplate from "next-common/components/overview/activeProposals/activeProposalTemplate";
import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import useFetchMyTreasuryDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits";
import { useSelector } from "react-redux";
import {
  myTreasuryBountyBondsSelector,
  myTreasuryBountyCuratorDepositsSelector,
  myTreasuryProposalDepositsSelector,
  myTreasuryTipDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";

export default function MyTreasuryDeposits() {
  useFetchMyTreasuryDeposits();

  const proposalDeposits = useSelector(myTreasuryProposalDepositsSelector);
  const bountyBonds = useSelector(myTreasuryBountyBondsSelector);
  const bountyCuratorDeposits = useSelector(
    myTreasuryBountyCuratorDepositsSelector,
  );
  const tipDeposits = useSelector(myTreasuryTipDepositsSelector);

  console.log(
    proposalDeposits,
    bountyBonds,
    bountyCuratorDeposits,
    tipDeposits,
  );

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;
  const activeCount = 0;
  const items = [
    {
      name: "Proposals",
    },
  ];

  return (
    <div>
      <ActiveProposalTemplate
        {...menu}
        activeCount={activeCount}
        items={items}
      />
    </div>
  );
}
