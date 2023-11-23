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
import { sum } from "lodash";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { useChain } from "next-common/context/chain";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { getBondBalanceColumn } from "./columns";

export default function MyTreasuryDeposits() {
  useFetchMyTreasuryDeposits();

  const chain = useChain();

  const proposalDeposits = useSelector(myTreasuryProposalDepositsSelector);
  const bountyBonds = useSelector(myTreasuryBountyBondsSelector);
  const bountyCuratorDeposits = useSelector(
    myTreasuryBountyCuratorDepositsSelector,
  );
  const tipDeposits = useSelector(myTreasuryTipDepositsSelector);

  const activeCount =
    sum([
      proposalDeposits?.length,
      bountyBonds?.length,
      bountyCuratorDeposits?.length,
      tipDeposits?.length,
    ]) || 0;

  console.log(
    proposalDeposits,
    bountyBonds,
    bountyCuratorDeposits,
    tipDeposits,
  );

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  const items = [
    {
      name: "Proposals",
      activeCount: proposalDeposits?.length || 0,
      formatter(item) {
        return normalizeTreasuryProposalListItem(chain, item);
      },
      columns: [
        getProposalPostTitleColumn(),
        getBondBalanceColumn(),
        getStatusTagColumn({ category: businessCategory.treasuryProposals }),
      ],
      api: {
        async fetchData() {
          if (proposalDeposits?.length) {
            const fetchers = proposalDeposits.map((deposit) =>
              nextApi.fetch(`treasury/proposals/${deposit.proposalIndex}`),
            );

            const resps = await Promise.all(fetchers);

            const items = resps.map((resp, idx) => {
              return {
                ...resp.result,
                ...proposalDeposits[idx],
              };
            });

            return {
              result: {
                items,
                total: activeCount,
              },
            };
          }

          return { result: EmptyList };
        },
      },
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
