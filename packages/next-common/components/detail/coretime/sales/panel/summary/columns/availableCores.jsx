import SummaryItem from "next-common/components/summary/layout/item";
import {
  Item,
  SummaryColumnGap,
} from "next-common/components/coretime/salePanel/summary/common";
import useCoretimeSale from "next-common/context/coretime/sale/provider";

export default function AvailableCores() {
  const { renewalCount, purchaseCount, info = {} } = useCoretimeSale();
  const { coresOffered = 0, coresSold = 0 } = info;
  const availableCores = coresOffered - coresSold;
  if (!info) {
    throw new Error(
      "Coretime sale info should be available on AvailableCores: AvailableCores",
    );
  }

  return (
    <SummaryColumnGap>
      <SummaryItem title="Available Cores">
        <div>
          {availableCores}
          <span className="text-textTertiary"> / {coresOffered}</span>
        </div>
      </SummaryItem>
      <SummaryItem>
        <div className="space-y-1 text12Medium text-textTertiary">
          <Item label="Sold" value={coresSold} />
          <Item label="↳ Renewed" value={renewalCount} />
          <Item label="↳ Purchased" value={purchaseCount} />
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}
