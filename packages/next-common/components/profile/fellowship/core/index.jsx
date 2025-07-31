import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipCoreEvidence from "./evidence";
import { ProfileFellowshipCoreFeedsServerFirst } from "./feeds";

export default function ProfileFellowshipCore() {
  const [evidenceCount, setEvidenceCount] = useState();

  const tabs = [
    {
      label: "Feeds",
      value: "feeds",
      content: <ProfileFellowshipCoreFeedsServerFirst />,
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
    <NeutralPanel className="p-6">
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => {
          setActiveTabValue(tab.value);
        }}
      />
    </NeutralPanel>
  );
}
