import SummaryItem from "./layout/item";
import SummaryLayout from "./layout/layout";
import { useAsync } from "react-use";
import { backendApi } from "next-common/services/nextApi";
import LoadableContent from "../common/loadableContent";
import { useRouter } from "next/router";

function useMultiAssetChildBountiesSummaryData() {
  const router = useRouter();
  const parent = router?.query?.parentBountyId;
  const apiUrl = parent
    ? `treasury/multi-asset-child-bounties/summary?parent=${parent}`
    : "treasury/multi-asset-child-bounties/summary";

  const { value: summary, loading } = useAsync(async () => {
    const { result } = await backendApi.fetch(apiUrl);
    return result;
  }, [apiUrl]);

  return {
    summary,
    loading,
  };
}

export default function MultiAssetChildBountiesSummary() {
  const { summary, loading } = useMultiAssetChildBountiesSummaryData();

  return (
    <LoadableContent isLoading={loading}>
      <SummaryLayout>
        <SummaryItem title="Total">{summary?.total ?? 0}</SummaryItem>
        <SummaryItem title="Created">{summary?.created ?? 0}</SummaryItem>
        <SummaryItem title="Active">{summary?.active ?? 0}</SummaryItem>
        <SummaryItem title="Paid">{summary?.paid ?? 0}</SummaryItem>
      </SummaryLayout>
    </LoadableContent>
  );
}
