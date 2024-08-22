import { useSelector } from "react-redux";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import CollectivesCoreSummary from "next-common/components/collectives/core/summary";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function FellowshipCoreMembersSummary() {
  const collectiveMembers = useSelector(fellowshipCollectiveMembersSelector);
  const { members: coreMembers } = useFellowshipCoreMembers();

  return (
    <CollectivesCoreSummary
      coreMembers={coreMembers}
      collectiveMembers={collectiveMembers}
    />
  );
}
