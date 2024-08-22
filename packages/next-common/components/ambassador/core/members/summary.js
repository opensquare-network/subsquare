import { useSelector } from "react-redux";
import { ambassadorCollectiveMembersSelector } from "next-common/store/reducers/ambassador/collective";
import CollectivesCoreSummary from "next-common/components/collectives/core/summary";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function AmbassadorCoreMembersSummary() {
  const collectiveMembers = useSelector(ambassadorCollectiveMembersSelector);
  const { members: coreMembers } = useFellowshipCoreMembers();

  return (
    <CollectivesCoreSummary
      coreMembers={coreMembers}
      collectiveMembers={collectiveMembers}
    />
  );
}
