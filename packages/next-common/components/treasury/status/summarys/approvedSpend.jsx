import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelItem";
import ValueDisplay from "next-common/components/valueDisplay";
import { useApprovedSpendStatistics } from "../hooks/useApprovedSpend";
import { toPrecision } from "next-common/utils";

export default function ApprovedSpend() {
  const { total, totalAmount, loading } = useApprovedSpendStatistics();

  return (
    <SummaryItem title="Approved spend">
      <LoadableContent isLoading={loading}>
        <span>{total}</span>
        <div className="!ml-0 flex flex-col gap-y-1">
          <SummaryLabelItem label={"Total"}>
            <ValueDisplay
              className="text-textPrimary"
              prefix="$"
              value={toPrecision(totalAmount)}
              symbol={""}
            />
          </SummaryLabelItem>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
