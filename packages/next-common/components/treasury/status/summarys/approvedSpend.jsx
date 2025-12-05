import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelItem";
import ValueDisplay from "next-common/components/valueDisplay";
import { useApprovedSpendStatistics } from "../hooks/useApprovedSpend";
import { toPrecision } from "next-common/utils";
import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";

export default function ApprovedSpend() {
  const { total, totalAmount, loading } = useApprovedSpendStatistics();

  return (
    <SummaryItem
      title={
        <div className="flex items-center gap-x-1">
          Spend
          <Tooltip content="Approved proposals users need to claim manually"></Tooltip>
        </div>
      }
    >
      <LoadableContent isLoading={loading}>
        <Link
          href="/treasury/spends?status=approved"
          className="text-textPrimary hover:underline"
        >
          {total}
        </Link>
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
