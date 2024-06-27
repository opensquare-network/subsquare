import { useSelector } from "react-redux";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { fellowshipCollectiveMembersSelector } from "next-common/store/reducers/fellowship/collective";
import CollectivesCoreSummary from "next-common/components/collectives/core/summary";

export default function FellowshipCoreMembersSummary() {
  const collectiveMembers = useSelector(fellowshipCollectiveMembersSelector);
  const coreMembers = useSelector(fellowshipCoreMembersSelector);
  return (
    <CollectivesCoreSummary
      coreMembers={coreMembers}
      collectiveMembers={collectiveMembers}
    />
  );
}
