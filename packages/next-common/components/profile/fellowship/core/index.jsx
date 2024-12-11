import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import ProfileFellowshipCoreEvidence from "./evidence";
import ProfileFellowshipCoreFeeds from "./feeds";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import ProfileFellowshipStatisticsInfo from "../statisticsInfo";

export default function ProfileFellowshipCore() {
  const { section } = useCollectivesContext();
  const [evidenceCount, setEvidenceCount] = useState();

  const tabs = [
    {
      label: "Feeds",
      value: "feeds",
      content: <ProfileFellowshipCoreFeeds />,
    },
    {
      label: "Evidence",
      value: "evidence",
      activeCount: evidenceCount,
      content: (
        <ProfileFellowshipCoreEvidence setEvidenceCount={setEvidenceCount} />
      ),
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ProfileFellowshipMemberInfo section={section} />
        <ProfileFellowshipStatisticsInfo section={section} />
      </div>

      <div className="space-y-4">
        <ProfileFellowshipModuleTabs />

        <NeutralPanel className="p-6">
          <Tabs
            tabs={tabs}
            activeTabValue={activeTabValue}
            onTabClick={(tab) => {
              setActiveTabValue(tab.value);
            }}
          />
        </NeutralPanel>
      </div>
    </div>
  );
}
