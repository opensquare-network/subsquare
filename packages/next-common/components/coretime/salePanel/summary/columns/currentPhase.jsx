import { Item, SummaryColumnGap } from "next-common/components/coretime/salePanel/summary/common";
import PhaseItem from "next-common/components/coretime/salePanel/summary/phase";
import SummaryItem from "next-common/components/summary/layout/item";

export default function CurrentPhase() {
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
