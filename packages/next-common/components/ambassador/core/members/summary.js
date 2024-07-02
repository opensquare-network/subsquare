import { useSelector } from "react-redux";
import { ambassadorCollectiveMembersSelector } from "next-common/store/reducers/ambassador/collective";
import { ambassadorCoreMembersSelector } from "next-common/store/reducers/ambassador/core";
import CollectivesCoreSummary from "next-common/components/collectives/core/summary";

export default function AmbassadorCoreMembersSummary() {
  const collectiveMembers = useSelector(ambassadorCollectiveMembersSelector);
  const coreMembers = useSelector(ambassadorCoreMembersSelector);

  return (
    <CollectivesCoreSummary
      coreMembers={coreMembers}
      collectiveMembers={collectiveMembers}
    />
  );
}
