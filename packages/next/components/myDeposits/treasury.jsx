import { getTreasuryMenu } from "next-common/utils/consts/menu/treasury";
import useFetchMyTreasuryDeposits from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits";
import { useSelector } from "react-redux";
import { myTreasuryTipDepositsSelector } from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import { sum } from "lodash";
import { useChain, useChainSettings } from "next-common/context/chain";
import { getStatusTagColumn } from "next-common/components/overview/activeProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import { getReasonPostTitleColumn } from "./columns";
import normalizeTipListItem from "next-common/utils/viewfuncs/treasury/normalizeTipListItem";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import DepositTemplate from "./depositTemplate";
import { useDepositTreasuryBountiesTab } from "./treasury/bounties";
import { useDepositTreasuryProposalsTab } from "./treasury/proposals";

export default function MyTreasuryDeposits() {
  useFetchMyTreasuryDeposits();

  const chain = useChain();
  const { decimals, symbol } = useChainSettings();

  const depositTreasuryProposalsTab = useDepositTreasuryProposalsTab();
  const depositTreasuryBountiesTab = useDepositTreasuryBountiesTab();

  const tipDeposits = useSelector(myTreasuryTipDepositsSelector);

  const activeCount = sum([
    depositTreasuryProposalsTab.activeCount,
    depositTreasuryBountiesTab.activeCount,
    tipDeposits?.length,
  ]);

  const menu = getTreasuryMenu();
  menu.pathname = menu.items[0].pathname;

  const items = [
    depositTreasuryProposalsTab,
    depositTreasuryBountiesTab,
    {
      name: "Tips",
      activeCount: tipDeposits?.length || 0,
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
          if (tipDeposits?.length) {
            const fetchers = tipDeposits.map((deposit) =>
              nextApi.fetch(`treasury/tips/${deposit.hash}`),
            );

            const resps = await Promise.all(fetchers);

            const items = resps.map((resp, idx) => {
              const result = resp.result;
              return {
                ...result,
                ...tipDeposits[idx],
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
    },
  ];

  return (
    <div>
      <DepositTemplate {...menu} activeCount={activeCount} items={items} />
    </div>
  );
}
