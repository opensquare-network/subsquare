import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import ProfileFellowshipCoreEvidence from "./evidence";
import ProfileFellowshipCoreTimeline from "./timeline";

export default function ProfileFellowshipCore() {
  const tabs = [
    {
      label: "Timeline",
      content: <ProfileFellowshipCoreTimeline />,
    },
    // TODO: fellowship profile, wait for evidence api ready
    false && {
      label: "Evidence",
      content: <ProfileFellowshipCoreEvidence />,
    },
  ].filter(Boolean);

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].label);

  return (
    <div className="space-y-6">
      <ProfileFellowshipMemberInfo />
      <ProfileFellowshipMemberInfo section="ambassador" />

      <div className="space-y-4">
        <ProfileFellowshipModuleTabs />

        <NeutralPanel className="p-6">
          <Tabs
            tabs={tabs}
            activeTabLabel={activeTabLabel}
            onTabClick={(tab) => {
              setActiveTabLabel(tab.label);
            }}
          />
        </NeutralPanel>
      </div>
    </div>
  );
}
