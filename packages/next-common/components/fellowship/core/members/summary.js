import CollectivesCoreSummary from "next-common/components/collectives/core/summary";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function FellowshipCoreMembersSummary() {
  const { members: collectiveMembers } = useFellowshipCollectiveMembers();
  const { members: coreMembers } = useFellowshipCoreMembersWithRank();

  return (
    <CollectivesCoreSummary
      coreMembers={coreMembers}
      collectiveMembers={collectiveMembers}
    />
  );
}
