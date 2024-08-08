import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import ProfileFellowshipCoreEvidence from "./evidence";
import ProfileFellowshipCoreTimeline from "./timeline";
import { useCollectivesContext } from "next-common/context/collectives/collectives";

export default function ProfileFellowshipCore() {
  const { section } = useCollectivesContext();
  const [evidenceCount, setEvidenceCount] = useState();

  const tabs = [
    {
      label: "Timeline",
      content: <ProfileFellowshipCoreTimeline />,
    },
    {
      label: "Evidence",
      activeCount: evidenceCount,
      content: (
        <ProfileFellowshipCoreEvidence setEvidenceCount={setEvidenceCount} />
      ),
    },
  ];

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].label);

  return (
    <div className="space-y-6">
      <ProfileFellowshipMemberInfo section={section} />

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
