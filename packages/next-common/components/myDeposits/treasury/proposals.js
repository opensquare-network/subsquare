import normalizeTreasuryProposalListItem from "next-common/utils/viewfuncs/treasury/normalizeProposalListItem";
import { useChain } from "next-common/context/chain";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/recentProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import { getBondBalanceColumn } from "../columns";
import isNil from "lodash.isnil";
import { fetchAndPopulateDetail } from "next-common/components/myDeposits/referenda/fetchAndPopulateDetail";

export function useDepositTreasuryProposalsTab(deposits = []) {
  const chain = useChain();

  return {
    loading: isNil(deposits),
    name: "Proposals",
    activeCount: deposits?.length || 0,
    formatter(item) {
      return normalizeTreasuryProposalListItem(chain, item);
    },
    columns: [
      getProposalPostTitleColumn(),
      getBondBalanceColumn(),
      getStatusTagColumn({ category: businessCategory.treasuryProposals }),
    ],
    api: {
      fetchData: fetchAndPopulateDetail.bind(
        null,
        deposits,
        "treasuryProposal",
      ),
    },
  };
}
