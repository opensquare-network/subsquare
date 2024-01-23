import isNil from "lodash.isnil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/recentProposals/columns";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import { myDemocracyDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myDemocracyDeposits";
import { toPrecision } from "next-common/utils";
import businessCategory from "next-common/utils/consts/business/category";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import { useSelector } from "react-redux";
import { fetchAndPopulateDetail } from "next-common/components/myDeposits/referenda/fetchAndPopulateDetail";

export function useDemocracyTableItems(deposits = []) {
  const chain = useChain();
  const { decimals, symbol } = useChainSettings();

  return [
    {
      name: "Public Proposal Deposits",
      activeCount: deposits?.length || 0,
      columns: [
        getProposalPostTitleColumn(),
        {
          name: "Reservation",
          className: "w-40 text-right",
          cellRender(data) {
            return (
              <ValueDisplay
                value={toPrecision(
                  data.depositCount * data.eachDepositValue,
                  decimals,
                )}
                symbol={symbol}
              />
            );
          },
        },
        getStatusTagColumn({ category: businessCategory.democracyProposals }),
      ],
      formatter: (item) => normalizeProposalListItem(chain, item),
      api: {
        fetchData: fetchAndPopulateDetail.bind(null, deposits, "democracy"),
      },
    },
  ];
}

export function useMyDepositDemocracy() {
  const deposits = useSelector(myDemocracyDepositsSelector);
  const activeCount = deposits?.length || 0;
  const loading = isNil(deposits);

  const menu = getDemocracyMenu();
  menu.pathname = menu.items[0].pathname;

  const items = useDemocracyTableItems(deposits);

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
