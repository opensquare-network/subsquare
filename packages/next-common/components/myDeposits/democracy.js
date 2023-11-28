import isNil from "lodash.isnil";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain, useChainSettings } from "next-common/context/chain";
import nextApi from "next-common/services/nextApi";
import { myDemocracyDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myDemocracyDeposits";
import { toPrecision } from "next-common/utils";
import { EmptyList } from "next-common/utils/constants";
import businessCategory from "next-common/utils/consts/business/category";
import { getDemocracyMenu } from "next-common/utils/consts/menu/democracy";
import normalizeProposalListItem from "next-common/utils/viewfuncs/democracy/normalizeProposalListItem";
import { useSelector } from "react-redux";

export function useMyDepositDemocracy() {
  const chain = useChain();
  const { decimals, symbol } = useChainSettings();
  const deposits = useSelector(myDemocracyDepositsSelector);
  const activeCount = deposits?.length || 0;
  const loading = isNil(deposits);

  const menu = getDemocracyMenu();
  menu.pathname = menu.items[0].pathname;

  const items = [
    {
      name: "Public Proposal Deposits",
      activeCount,
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
        async fetchData() {
          if (deposits?.length) {
            const fetchers = deposits.map((deposit) =>
              nextApi.fetch(`democracy/proposals/${deposit.proposalIndex}`),
            );

            const resps = await Promise.all(fetchers);

            const items = resps.map((resp, idx) => {
              return {
                ...resp.result,
                ...deposits[idx],
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

  return {
    ...menu,
    activeCount,
    items,
    loading,
  };
}
