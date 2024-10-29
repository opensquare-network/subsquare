import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import PhaseItem from "next-common/components/coretime/salePanel/summary/phase";
import PriceItem from "next-common/components/coretime/salePanel/summary/price";
import { Item, SummaryColumnGap } from "./columns/common";
import AvailableCoresSummary from "./columns/availableCores";

// TODO: move into ./column
function CurrentPriceSummary({ data }) {
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryColumnGap>
      <PriceItem />
      <SummaryItem>
        <div className="space-y-1 text12Medium text-textTertiary">
          <Item
            label="Revenue"
            value={
              <ValueDisplay
                className="text-textPrimary"
                value={toPrecision(data?.totalRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
          <Item
            label="↳ Renewal"
            value={
              <ValueDisplay
                className="text-textPrimary"
                value={toPrecision(data?.renewalRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
          <Item
            label="↳ Sale"
            value={
              <ValueDisplay
                className="text-textPrimary"
                value={toPrecision(data?.purchaseRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}

// TODO: move into ./column
function CurrentPhaseSummary() {
  return (
    <SummaryColumnGap>
      <PhaseItem />
      <SummaryItem>
        <div className="text12Medium">
          <Item label="End in" value="[time]" />
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}

// TODO: move into ./column
function SalePeriodSummary() {
  return (
    <SummaryColumnGap>
      <SummaryItem title="Sale Period">
        <div>[time]</div>
      </SummaryItem>
      <SummaryItem>
        <div className="space-y-1 text12Medium">
          <Item label="End At" value="[time]" />
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}

export default function CoretimeSaleSummary({ data }) {
  return (
    <div>
      <SummaryLayout>
        <CurrentPriceSummary data={data} />
        <AvailableCoresSummary data={data} />
        <CurrentPhaseSummary />
        <SalePeriodSummary />
      </SummaryLayout>
    </div>
  );
}
