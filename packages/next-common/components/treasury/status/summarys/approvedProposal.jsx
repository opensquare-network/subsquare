import LoadableContent from "next-common/components/common/loadableContent";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLabelItem from "next-common/components/summary/polkadotTreasurySummary/common/summaryLabelItem";
import ValueDisplay from "next-common/components/valueDisplay";
import { useApprovedProposalStatistics } from "../hooks/useApprovedProposal";
import { toPrecision } from "next-common/utils";
import Link from "next/link";
import Tooltip from "next-common/components/tooltip";

export default function ApprovedProposal() {
  const { total, totalAmount, loading } = useApprovedProposalStatistics();

  return (
    <SummaryItem
      title={
        <div className="flex items-center gap-x-1">
          Proposal
          <Tooltip content="Approved proposals which will be allocated to beneficiaries automatically by the end of the spend priod"></Tooltip>
        </div>
      }
    >
      <LoadableContent isLoading={loading}>
        <Link
          href="/treasury/proposals"
          className="text-textPrimary hover:underline"
        >
          {total}
        </Link>
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
