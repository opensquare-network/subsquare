import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipCoreSectionTimeline from "./timeline";
import ProfileFellowshipCoreSectionEvidence from "./evidence";

export default function ProfileFellowshipCoreSection() {
  const tabs = [
    {
      label: "Timeline",
      content: <ProfileFellowshipCoreSectionTimeline />,
    },
    // TODO: fellowship profile, wait for evidence api ready
    false && {
      label: "Evidence",
      content: <ProfileFellowshipCoreSectionEvidence />,
    },
  ].filter(Boolean);

  const [activeTabLabel, setActiveTabLabel] = useState(tabs[0].label);

  return (
    <NeutralPanel className="p-6">
      <Tabs
        tabs={tabs}
        activeTabLabel={activeTabLabel}
        onTabClick={(tab) => {
          setActiveTabLabel(tab.label);
        }}
      />
    </NeutralPanel>
  );
}
