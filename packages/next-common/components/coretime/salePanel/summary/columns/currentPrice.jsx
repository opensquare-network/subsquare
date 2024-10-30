import SummaryItem from "next-common/components/summary/layout/item";
import PriceItem from "next-common/components/coretime/salePanel/summary/price";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { Item, SummaryColumnGap } from "../common";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function CurrentPrice() {
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