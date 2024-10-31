import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { Item, SummaryColumnGap } from "./common";
import CurrentPrice from "./columns/currentPrice";
import AvailableCores from "./columns/availableCores";
import CurrentPhase from "./columns/currentPhase";

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
