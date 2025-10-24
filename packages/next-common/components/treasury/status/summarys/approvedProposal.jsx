import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelItem";
import ValueDisplay from "next-common/components/valueDisplay";
import { useApprovedProposalStatistics } from "../hooks/useApprovedProposal";
import { toPrecision } from "next-common/utils";

export default function ApprovedProposal() {
  const { total, totalAmount, loading } = useApprovedProposalStatistics();

  return (
    <SummaryItem title="Approved proposal">
      <LoadableContent isLoading={loading}>
        <span>{total}</span>
        <div className="!ml-0 flex flex-col gap-y-1">
          <SummaryLabelItem label={"Total"}>
            <ValueDisplay
              className="text-textPrimary"
              value={toPrecision(totalAmount)}
              symbol={""}
              prefix="$"
            />
          </SummaryLabelItem>
        </div>
      </LoadableContent>
    </SummaryItem>
  );
}
