import { useChain, useChainSettings } from "next-common/context/chain";
import { getStatusTagColumn } from "next-common/components/overview/recentProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { getReasonPostTitleColumn } from "../columns";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { isNil } from "lodash-es";

export function useDepositTreasuryTipsTab(deposits = []) {
  const chain = useChain();
  const { decimals, symbol } = useChainSettings();
  const activeCount = deposits?.length || 0;

  return {
    loading: isNil(deposits),
    name: "Tips",
    activeCount: deposits?.length || 0,
    formatter(item) {
      return normalizeTipListItem(chain, item);
    },
    columns: [
      getReasonPostTitleColumn(),
      {
        name: "Bond Balance",
        className: "w-40 text-right",
        cellRender(data) {
          return (
            <ValueDisplay
              className="text14Medium text-textPrimary"
              value={toPrecision(data.deposit, decimals)}
              symbol={symbol}
            />
          );
        },
      },
      getStatusTagColumn({ category: businessCategory.treasuryTips }),
    ],
    api: {
      async fetchData() {
        if (deposits?.length) {
          const fetchers = deposits.map((deposit) =>
            backendApi.fetch(`treasury/tips/${deposit.hash}`),
          );

          const resps = await Promise.all(fetchers);

          const items = resps.map((resp, idx) => {
            const result = resp.result;
            return {
              ...result,
              ...deposits[idx],
              // NOTE: copied from backend
              state: {
                state: result.onchainData?.state?.state,
                tipsCount: result.onchainData?.meta?.tips?.length || 0,
              },
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
