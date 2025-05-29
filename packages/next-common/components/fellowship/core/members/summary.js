import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";
import { isNil } from "lodash-es";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";

export default function FellowshipMembersSummary() {
  const { members: collectiveMembers } = useFellowshipCollectiveMembers();
  const { members: coreMembers } = useFellowshipCoreMembersWithRank();

  const total = (collectiveMembers || []).length;
  const candidates = (collectiveMembers || []).filter((m) => m.rank <= 0);
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
      <SummaryItem title="Not in Core">
        <LoadableContent isLoading={isLoading}>
          {collectiveMembers?.length - (coreMembers || []).length}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
