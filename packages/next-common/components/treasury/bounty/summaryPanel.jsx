import SummaryItem from "next-common/components/summary/layout/item";
import { useContextApi } from "next-common/context/api";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import LoadableContent from "next-common/components/common/loadableContent";
import TreasurySummary from "next-common/components/summary/treasurySummary";
// import FiatPriceLabel from "next-common/components/summary/polkadotTreasurySummary/common/fiatPriceLabel";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { useBountiesSummary } from "next-common/hooks/treasury/bounty/useBountiesSummary";
import { isNil, lowerCase } from "lodash-es";
import PriceDisplay from "next-common/components/summary/treasurySummary/priceDisplay";

export function BountiesSummaryPanelImpl() {
  const { symbol, decimals } = useChainSettings();
  const { groupedTotal, isLoading, totalBalance = 0 } = useBountiesSummary();

  return (
    <LoadableContent isLoading={isLoading || isNil(groupedTotal)}>
      <PriceDisplay value={totalBalance} />
      <div className="flex items-center gap-x-2 mt-2 !ml-0">
        {Object.entries(groupedTotal || {}).map(([label, value]) => (
          <Tooltip
            key={label}
            content={
              <>
                There are {value.count} {lowerCase(label)} bounties with a total
                value of{" "}
                <ValueDisplay
                  value={toPrecision(value.total, decimals)}
                  symbol={symbol}
                />
              </>
            }
          >
            <BalanceWrapper>
              <div className="inline-flex items-center gap-x-1 text12Medium text-textTertiary">
                <span>{label}</span>
                <span>·</span>
                <span className="text12Medium text-textSecondary">
                  {value.count}
                </span>
                <span>·</span>
              </div>
              <PriceDisplay
                valueClassName="text12Medium h-4"
                value={value.total}
                showExtraInfo={false}
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
