import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import SpendPeriod from "next-common/components/treasury/status/summarys/spendPeriod";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";
import TreasurySummary from "./treasurySummary";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import LoadableContent from "../common/loadableContent";

export default function TreasuryProposalsSummary() {
  const chain = useChain();

  if (isKintsugiChain(chain)) {
    return <TreasurySummary />;
  }

  return <TreasuryProposalsSummaryImpl />;
}

function TreasuryProposalsSummaryImpl() {
  const { value: proposalsSummary, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch("treasury/proposals/summary");
    return result;
  }, []);

  const { totalProposalsCount, detail = {} } = proposalsSummary ?? {};

  return (
    <LoadableContent isLoading={loading}>
      <SummaryLayout>
        <SummaryItem title="Total">{totalProposalsCount}</SummaryItem>
        <SummaryItem title="Proposed">{detail?.Proposed ?? 0}</SummaryItem>
        <SummaryItem title="Approved">{detail?.Approved ?? 0}</SummaryItem>
        <SummaryItem title="Rejected">{detail?.Rejected ?? 0}</SummaryItem>
        <SpendPeriod />
      </SummaryLayout>
    </LoadableContent>
  );
}
