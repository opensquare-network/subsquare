import SummaryItem from "next-common/components/summary/layout/item";
import { Item, SummaryColumnGap } from "./common";

export default function AvailableCoresSummary({ data }) {
  return (
    <SummaryColumnGap>
      <SummaryItem title="Available Cores">
        {data?.info ? (
          <div>
            {data?.info?.coresSold}
            <span className="text-textTertiary">
              {" "}
              / {data?.info?.coresOffered}
            </span>
          </div>
        ) : (
          <div className="text-textTertiary">-</div>
        )}
      </SummaryItem>
      <SummaryItem>
        <div className="space-y-1 text12Medium text-textTertiary">
          <Item label="Sold" value="[0]" />
          <Item label="↳ Renewed" value={data?.renewalCount} />
          <Item label="↳ Sold" value={data?.purchaseCount} />
        </div>
      </SummaryItem>
    </SummaryColumnGap>
  );
}
