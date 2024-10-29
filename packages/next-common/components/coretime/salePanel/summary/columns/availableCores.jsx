import SummaryItem from "next-common/components/summary/layout/item";
import { Item, SummaryColumnGap } from "../common";

export default function AvailableCores({ data = {} }) {
  const { renewalCount, purchaseCount, info = {} } = data;
  const { coresOffered = 0, coresSold = 0 } = info;
  const availableCores = coresOffered - coresSold;

  return (
    <SummaryColumnGap>
      <SummaryItem title="Available Cores">
        {info ? (
          <div>
            {availableCores}
            <span className="text-textTertiary"> / {coresOffered}</span>
          </div>
        ) : (
          <div className="text-textTertiary">-</div>
        )}
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
