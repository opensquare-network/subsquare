import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import ProfileFellowshipStatisticsInfo from "../statisticsInfo";
import VoteActivities from "next-common/components/pages/fellowship/member/fellowshipMember/voteActivities";

export default function ProfileFellowshipCore() {
  const { section } = useCollectivesContext();
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ProfileFellowshipMemberInfo section={section} />
        <ProfileFellowshipStatisticsInfo section={section} />
      </div>

      <div className="space-y-4">
        <ProfileFellowshipModuleTabs />

        <VoteActivities />
      </div>
    </div>
  );
}
