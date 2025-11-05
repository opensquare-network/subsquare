import { usePageProps } from "next-common/context/page";
import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import { isNil } from "lodash-es";

export default function TreasuryProposalsSummary() {
  const { proposalsSummary } = usePageProps();

  if (isNil(proposalsSummary)) {
    return null;
  }

  const { totalProposalsCount, detail = {} } = proposalsSummary;

  return (
    <SummaryLayout>
      <SummaryItem title="Total">{totalProposalsCount}</SummaryItem>
      <SummaryItem title="Proposed">{detail?.Proposed ?? 0}</SummaryItem>
      <SummaryItem title="To Be Awarded">{detail?.Approved ?? 0}</SummaryItem>
      <SummaryItem title="Rejected">{detail?.Rejected ?? 0}</SummaryItem>
    </SummaryLayout>
  );
}
