import SummaryItem from "next-common/components/summary/layout/item";
import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import LoadableContent from "next-common/components/common/loadableContent";

export function BountiesSummaryPanelImpl({ bounties = [], loading = false }) {
  const { symbol, decimals } = useChainSettings();
  const [total, setTotal] = useState(new BigNumber(0));
  const [groupedTotal, setGroupedTotal] = useState({});

  useEffect(() => {
    if (bounties.length > 0) {
      let allTotal = new BigNumber(0);
      const totalMap = {
        Active: new BigNumber(0),
        Proposed: new BigNumber(0),
        Funded: new BigNumber(0),
      };
      const countMap = {
        Active: 0,
        Proposed: 0,
        Funded: 0,
      };
      for (const item of bounties) {
        const data = item.value;
        allTotal = allTotal.plus(data.value);
        if (data.status.isActive) {
          totalMap.Active = totalMap.Active.plus(data.value);
          countMap.Active++;
        }
        if (data.status.isFunded) {
          totalMap.Funded = totalMap.Funded.plus(data.value);
          countMap.Funded++;
        }
        if (data.status.isProposed) {
          totalMap.Proposed = totalMap.Proposed.plus(data.value);
          countMap.Proposed++;
        }
      }
      setTotal(allTotal);
      setGroupedTotal({
        Active: {
          total: totalMap.Active,
          count: countMap.Active,
        },
        Proposed: {
          total: totalMap.Proposed,
          count: countMap.Proposed,
        },
        Funded: {
          total: totalMap.Funded,
          count: countMap.Funded,
        },
      });
    }
  }, [bounties]);

  return (
    <LoadableContent isLoading={loading}>
      <ValueDisplay value={toPrecision(total, decimals)} symbol={symbol} />
      <div className="flex items-center gap-x-2 mt-2">
        {Object.entries(groupedTotal).map(([label, value]) => (
          <Tooltip
            key={label}
            content={
              <>
                {label} has {value.count} bounties with a total value of{" "}
                <ValueDisplay
                  value={toPrecision(value.total, decimals)}
                  symbol={symbol}
                />
              </>
            }
          >
            <BalanceWrapper>
              <div className="inline-flex items-center gap-x-1">
                <BalanceLabel>{label}</BalanceLabel>
                <BalanceLabel>·</BalanceLabel>
                <span className="text12Medium">{value.count}</span>
                <BalanceLabel>·</BalanceLabel>
              </div>
              <ValueDisplay
                className="text12Medium h-4"
                value={toPrecision(value.total, decimals)}
                symbol={symbol}
                showTooltip={false}
              />
            </BalanceWrapper>
          </Tooltip>
        ))}
      </div>
    </LoadableContent>
  );
}

export default function BountiesSummaryPanel() {
  const [bountieMap, setBountieMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const api = useContextApi();

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoading(true);
    api.query.bounties.bounties
      .entries()
      .then((result) => {
        const entries = result.map(([entryIndex, value]) => {
          const [id] = entryIndex.toHuman() || [];
          return [id, value];
        });
        setBountieMap(Object.fromEntries(entries));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  return (
    <SummaryItem title="Total">
      <BountiesSummaryPanelImpl
        loading={isLoading}
        bounties={Object.values(bountieMap)}
      />
    </SummaryItem>
  );
}

function BalanceWrapper({ children }) {
  return (
    <div className="bg-neutral200 py-1 px-2 rounded-[4px] flex items-center gap-x-2 h-6 text-textSecondary">
      {children}
    </div>
  );
}

function BalanceLabel({ children }) {
  return <span className="text12Medium text-textTertiary">{children}</span>;
}
