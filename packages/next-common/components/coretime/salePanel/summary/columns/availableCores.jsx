import SummaryItem from "next-common/components/summary/layout/item";
import { Item, SummaryColumnGap } from "../common";
import useCoretimeSale, {
  useCoretimeSaleInfo,
} from "next-common/context/coretime/sale/provider";

export default function AvailableCores() {
  const { renewalCount, purchaseCount } = useCoretimeSale();
  const info = useCoretimeSaleInfo();

  const { coresOffered = 0, coresSold = 0 } = info;
  const availableCores = coresOffered - coresSold;

  return (
    <SummaryColumnGap>
      <SummaryItem title="Available Cores" className="!flex-none">
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
