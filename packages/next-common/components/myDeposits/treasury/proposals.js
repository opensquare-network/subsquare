import { useSelector } from "react-redux";
import { myTreasuryProposalDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { useChain } from "next-common/context/chain";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { getBondBalanceColumn } from "../columns";
import isNil from "lodash.isnil";

export function useDepositTreasuryProposalsTab() {
  const chain = useChain();
  const proposalDeposits = useSelector(myTreasuryProposalDepositsSelector);
  const loading = isNil(proposalDeposits);

  const activeCount = proposalDeposits?.length || 0;

  return {
    loading,
    name: "Proposals",
    activeCount,
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
  };
}
