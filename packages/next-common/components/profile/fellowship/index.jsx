import { usePageProps } from "next-common/context/page";
import ProfileFellowshipCore from "./core";
import ProfileFellowshipSalary from "./salary";
import ProfileFellowshipVotes from "./votes";
import { usePathname } from "next/navigation";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import ProfileFellowshipMemberInfo from "./memberInfo";
import ProfileFellowshipStatisticsInfo from "./statisticsInfo";
import ProfileFellowshipModuleTabs from "./moduleTabs";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import ProfileFellowshipEvidence from "./evidence";

function ProfileFellowshipContent() {
  const pathname = usePathname();
  const { id } = usePageProps();
  const maybeEvmAddress = tryConvertToEvmAddress(id);

  const panelPath = `/user/${maybeEvmAddress}/fellowship`;

  if (pathname === panelPath) {
    return <ProfileFellowshipVotes />;
  } else if (pathname === `${panelPath}/membership`) {
    return <ProfileFellowshipCore />;
  } else if (pathname === `${panelPath}/salary`) {
    return <ProfileFellowshipSalary />;
  }
  return null;
}

export default function ProfileFellowship() {
  const { section } = useCollectivesContext();
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ProfileFellowshipMemberInfo section={section} />
        <ProfileFellowshipStatisticsInfo section={section} />
        <ProfileFellowshipEvidence section={section} />
      </div>

      <div className="space-y-4">
        <ProfileFellowshipModuleTabs />

        <ProfileFellowshipContent />
      </div>
    </div>
  );
}
