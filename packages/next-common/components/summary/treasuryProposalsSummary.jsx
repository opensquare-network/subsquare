import { usePageProps } from "next-common/context/page";
import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import { isNil } from "lodash-es";
import SpendPeriod from "next-common/components/treasury/status/summarys/spendPeriod";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import TreasurySummary from "./treasurySummary";

export default function TreasuryProposalsSummary() {
  const chain = useChain();

  if (isKintsugiChain(chain)) {
    return <TreasurySummary />;
  }

  return <TreasuryProposalsSummaryImpl />;
}

function TreasuryProposalsSummaryImpl() {
  const { proposalsSummary } = usePageProps();

  if (isNil(proposalsSummary)) {
    return null;
  }

  const { totalProposalsCount, detail = {} } = proposalsSummary;

  return (
    <SummaryLayout>
      <SummaryItem title="Total">{totalProposalsCount}</SummaryItem>
      <SummaryItem title="Proposed">{detail?.Proposed ?? 0}</SummaryItem>
      <SummaryItem title="Approved">{detail?.Approved ?? 0}</SummaryItem>
      <SummaryItem title="Rejected">{detail?.Rejected ?? 0}</SummaryItem>
      <SpendPeriod />
    </SummaryLayout>
  );
}
