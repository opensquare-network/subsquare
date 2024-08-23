import CollectivesCoreSummary from "next-common/components/collectives/core/summary";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function AmbassadorCoreMembersSummary() {
  const { members: collectiveMembers } = useFellowshipCollectiveMembers();
  const { members: coreMembers } = useFellowshipCoreMembers();

  return (
    <CollectivesCoreSummary
      coreMembers={coreMembers}
      collectiveMembers={collectiveMembers}
    />
  );
}
