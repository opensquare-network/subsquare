import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function FellowshipCoreMembersSummary() {
  const fellowshipMembers = useSelector(fellowshipCollectiveMembersSelector);
  const coreMembers = useSelector(fellowshipCoreMembersSelector);
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
          {fellowshipMembers?.length - total}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
