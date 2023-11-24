import { useSelector } from "react-redux";
import {
  myTreasuryBountyBondsSelector,
  myTreasuryBountyCuratorDepositsSelector,
} from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import { isNil, sum } from "lodash";
import { useChain } from "next-common/context/chain";
import {
  getProposalPostTitleColumn,
  getStatusTagColumn,
} from "next-common/components/overview/activeProposals/columns";
import businessCategory from "next-common/utils/consts/business/category";
import { getBondBalanceColumn } from "../columns";
import { cn } from "next-common/utils";
import normalizeBountyListItem from "next-common/utils/viewfuncs/treasury/normalizeBountyListItem";
import { BaseTag } from "next-common/components/tags/state/styled";
import { useEffect, useState } from "react";
import { EmptyList } from "next-common/utils/constants";
import nextApi from "next-common/services/nextApi";

export function useDepositTreasuryBountiesTab() {
  const chain = useChain();

  const bountyBonds = useSelector(myTreasuryBountyBondsSelector);
  const bountyCuratorDeposits = useSelector(
    myTreasuryBountyCuratorDepositsSelector,
  );
  const loading = isNil(bountyBonds) || isNil(bountyCuratorDeposits);

  const bountyActiveCount =
    sum([bountyBonds?.length, bountyCuratorDeposits?.length]) || 0;

  const sources = [
    {
      label: "Bounty Deposits",
      count: bountyBonds?.length,
    },
    { label: "Curator Deposits", count: bountyCuratorDeposits?.length },
  ];
  const [sourceLabel, setSourceLabel] = useState(sources[0].label);

  const [bountyDepositsResult, setBountyDepositsResult] = useState(EmptyList);
  const [curatorDepositsResult, setCuratorDepositsResult] = useState(EmptyList);
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
        return sourceLabel === sources[0].label
          ? { result: bountyDepositsResult }
          : { result: curatorDepositsResult };
      },
    },
    tableHead: (
      <div className="space-x-2 mb-2">
        {sources.map((source) => (
          <SwitchTag
            active={sourceLabel === source.label}
            key={source.label}
            label={source.label}
            count={source.count}
            onClick={() => setSourceLabel(source.label)}
          />
        ))}
      </div>
    ),
  };
}

function SwitchTag({ active, count, label, className, ...props }) {
  return (
    <BaseTag
      {...props}
      className={cn(
        active
          ? "bg-theme100 !text-theme500"
          : "bg-neutral200 !text-textPrimary",
        "cursor-pointer",
        className,
      )}
    >
      {label}
      <span
        className={cn("ml-1", active ? "text-theme300" : "text-textTertiary")}
      >
        {count}
      </span>
    </BaseTag>
  );
}
