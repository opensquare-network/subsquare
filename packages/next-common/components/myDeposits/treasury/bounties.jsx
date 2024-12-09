import { useChain } from "next-common/context/chain";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/recentProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import { getBondBalanceColumn } from "../columns";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import { useEffect, useState } from "react";
import { EmptyList } from "next-common/utils/constants";
import nextApi from "next-common/services/nextApi";
import { useShallowCompareEffect } from "react-use";
import { isNil } from "lodash-es";
import { sum } from "lodash-es";
import CheckableTag from "next-common/components/tags/checkable";

export function useDepositTreasuryBountiesTab(
  bountyBonds = [],
  bountyCuratorDeposits = [],
) {
  const chain = useChain();

  const loading = isNil(bountyBonds) || isNil(bountyCuratorDeposits);

  const bountyActiveCount =
    sum([bountyBonds?.length, bountyCuratorDeposits?.length]) || 0;

  const [bountyDepositsResult, setBountyDepositsResult] = useState(EmptyList);
  const [curatorDepositsResult, setCuratorDepositsResult] = useState(EmptyList);

  const subTabs = [
    {
      value: "bounty_deposits",
      label: "Bounty Deposits",
      count: bountyBonds?.length,
      data: bountyDepositsResult,
    },
    {
      value: "curator_deposits",
      label: "Curator Deposits",
      count: bountyCuratorDeposits?.length,
      data: curatorDepositsResult,
    },
  ].filter((subTab) => subTab.count);

  const subTabValues = subTabs.map((subTab) => subTab.value);
  const [subTabActiveValue, setSubTabActiveValue] = useState(subTabValues[0]);

  useShallowCompareEffect(() => {
    setSubTabActiveValue(subTabValues[0]);
  }, [subTabValues]);

  useEffect(() => {
    if (bountyBonds?.length) {
      const fetchers = bountyBonds.map((deposit) =>
        nextApi.fetch(`treasury/bounties/${deposit.proposalIndex}`),
      );

      Promise.all(fetchers).then((resps) => {
        const items = resps.map((resp, idx) => {
          const result = resp.result;

          return {
            ...result,
            ...bountyBonds[idx],
          };
        });

        const result = {
          items,
          total: bountyBonds?.length,
        };

        setBountyDepositsResult(result);
      });
    }

    if (bountyCuratorDeposits?.length) {
      const fetchers = bountyCuratorDeposits.map((deposit) =>
        nextApi.fetch(`treasury/bounties/${deposit.proposalIndex}`),
      );

      Promise.all(fetchers).then((resps) => {
        const items = resps.map((resp, idx) => {
          const result = resp.result;

          return {
            ...result,
            ...bountyCuratorDeposits[idx],
          };
        });

        const result = {
          items,
          total: bountyCuratorDeposits?.length,
        };

        setCuratorDepositsResult(result);
      });
    }
  }, [bountyBonds, bountyCuratorDeposits]);

  return {
    loading,
    name: "Bounties",
    activeCount: bountyActiveCount,
    formatter(item) {
      return normalizeBountyListItem(chain, item);
    },
    columns: [
      getProposalPostTitleColumn(),
      getBondBalanceColumn(),
      getStatusTagColumn({ category: businessCategory.treasuryBounties }),
    ],
    api: {
      async fetchData() {
        const result =
          subTabs.find((subTab) => subTab.value === subTabActiveValue)?.data ??
          EmptyList;

        return { result };
      },
    },
    tableHead: (
      <div className="flex items-center gap-x-2 mb-4">
        {subTabs.map((subTab) => (
          <CheckableTag
            checked={subTabActiveValue === subTab.value}
            key={subTab.value}
            count={subTab.count}
            onClick={() => setSubTabActiveValue(subTab.value)}
          >
            {subTab.label}
          </CheckableTag>
        ))}
      </div>
    ),
  };
}
