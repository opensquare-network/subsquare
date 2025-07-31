import { useCollectivesContext } from "next-common/context/collectives/collectives";
import ProfileFellowshipMemberInfo from "./memberInfo";
import ProfileFellowshipStatisticsInfo from "./statisticsInfo";
import ProfileFellowshipModuleTabs from "./moduleTabs";

export default function FellowshipCommonLayout({ children }) {
  const { section } = useCollectivesContext();
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ProfileFellowshipMemberInfo section={section} />
        <ProfileFellowshipStatisticsInfo section={section} />
      </div>

      <div className="space-y-4">
        <ProfileFellowshipModuleTabs />

        {children}
      </div>
    </div>
  );
}
