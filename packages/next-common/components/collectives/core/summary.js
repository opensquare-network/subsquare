import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import { isNil } from "lodash-es";

export default function CollectivesCoreSummary({
  collectiveMembers,
  coreMembers,
}) {
  const candidates = (coreMembers || []).filter((m) => m.rank <= 0);
  const total = (coreMembers || []).length;
  const isLoading = isNil(coreMembers);

  return (
    <SummaryLayout>
      <SummaryItem title="Total">
        <LoadableContent isLoading={isLoading}>{total}</LoadableContent>
      </SummaryItem>
      <SummaryItem title="Members">
        <LoadableContent isLoading={isLoading}>
          {total - candidates.length}
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Candidates">
        <LoadableContent isLoading={isLoading}>
          {candidates.length}
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Not Inducted">
        <LoadableContent isLoading={isLoading}>
          {collectiveMembers?.length - total}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
