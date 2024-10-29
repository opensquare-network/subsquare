import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import PhaseItem from "next-common/components/coretime/salePanel/summary/phase";
import PriceItem from "next-common/components/coretime/salePanel/summary/price";
import { Item, SummaryColumnGap } from "./common";
import AvailableCores from "./columns/availableCores";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

// TODO: move into ./columns
function CurrentPrice() {
  const { decimals, symbol } = useChainSettings();
  const { totalRevenue, renewalRevenue, purchaseRevenue } = useCoretimeSale();

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
                value={toPrecision(totalRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
          <Item
            label="↳ Renewal"
            value={
              <ValueDisplay
                className="text-textPrimary"
                value={toPrecision(renewalRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
          <Item
            label="↳ Sale"
            value={
              <ValueDisplay
                className="text-textPrimary"
                value={toPrecision(purchaseRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}

// TODO: move into ./columns
function CurrentPhase() {
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

// TODO: move into ./columns
function SalePeriod() {
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

export default function CoretimeSaleSummary() {
  return (
    <div>
      <SummaryLayout>
        <CurrentPrice />
        <AvailableCores />
        <CurrentPhase />
        <SalePeriod />
      </SummaryLayout>
    </div>
  );
}
