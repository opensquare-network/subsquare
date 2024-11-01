import SummaryItem from "next-common/components/summary/layout/item";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { Item } from "next-common/components/coretime/salePanel/summary/common";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { isNil } from "lodash-es";

export default function Revenue() {
  const { decimals, symbol } = useChainSettings();
  const { totalRevenue, renewalRevenue, purchaseRevenue } = useCoretimeSale();

  if (isNil(totalRevenue) || isNil(renewalRevenue) || isNil(purchaseRevenue)) {
    return null;
  }

  return (
    <div className="space-y-1">
      <SummaryItem title="Revenue">
        <ValueDisplay
          className="text-textPrimary"
          value={toPrecision(totalRevenue, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
      <SummaryItem>
        <div className="space-y-1 text12Medium text-textTertiary">
          <Item
            label="Renewal"
            value={
              <ValueDisplay
                className="text-textPrimary"
                value={toPrecision(renewalRevenue, decimals)}
                symbol={symbol}
              />
            }
          />
          <Item
            label="Sale"
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
    </div>
  );
}
