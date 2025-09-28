import SummaryItem from "next-common/components/summary/layout/item";
import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import LoadableContent from "next-common/components/common/loadableContent";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import FieldLoading from "next-common/components/icons/fieldLoading";

export function BountiesSummaryPanelImpl() {
  const { symbol, decimals } = useChainSettings();
  const [bounties, setBounties] = useState([]);
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
        setBounties(entries);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [api]);

  const { total, groupedTotal } = useMemo(() => {
    let allTotal = new BigNumber(0);
    const groupedMap = {
      Active: {
        total: new BigNumber(0),
        count: 0,
      },
      Funded: {
        total: new BigNumber(0),
        count: 0,
      },
      Proposed: {
        total: new BigNumber(0),
        count: 0,
      },
      Approved: {
        total: new BigNumber(0),
        count: 0,
      },
    };
    if (bounties.length > 0) {
      for (const item of bounties) {
        const data = item[1];
        const status = data.value.status;
        const json = data.toJSON();
        const value = json.value || 0;

        const isFunded = status.isFunded || status.isCuratorProposed;

        if (!isFunded) {
          // Funded are not included in the total
          allTotal = allTotal.plus(value);
        }
        if (status.isActive || status.isPendingPayout) {
          groupedMap.Active.count++;
          groupedMap.Active.total = groupedMap.Active.total.plus(value);
        } else if (isFunded) {
          groupedMap.Funded.count++;
          groupedMap.Funded.total = groupedMap.Funded.total.plus(value);
        } else if (status.isProposed) {
          groupedMap.Proposed.count++;
          groupedMap.Proposed.total = groupedMap.Proposed.total.plus(value);
        } else if (status.isApproved || status.isApprovedWithCurator) {
          groupedMap.Approved.count++;
          groupedMap.Approved.total = groupedMap.Approved.total.plus(value);
        }
      }
    }

    if (groupedMap.Approved.count === 0) {
      // if there are no approved bounties, don't show the approved group
      delete groupedMap.Approved;
    }

    return {
      total: allTotal,
      groupedTotal: groupedMap,
    };
  }, [bounties]);

  return (
    <LoadableContent isLoading={isLoading}>
      <div className="flex flex-col">
        <div>
          <ValueDisplay
            className="inline-flex"
            value={toPrecision(total, decimals)}
            symbol={symbol}
          />
        </div>
        <span className="text12Medium text-textTertiary">
          <FiatPriceLabel free={total} />
        </span>
      </div>
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
  const api = useContextApi();

  if (!api) {
    return <FieldLoading />;
  }

  if (!api.query?.bounties?.bounties) {
    return <TreasurySummary />;
  }

  return (
    <SummaryItem title="Total Bounty Value">
      <BountiesSummaryPanelImpl />
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
