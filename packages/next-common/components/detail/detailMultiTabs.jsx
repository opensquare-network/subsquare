import { useState } from "react";
import Tabs from "../tabs";

export default function DetailMultiTabs({
  defaultActiveTabLabel = "",
  call,
  business,
  metadata,
  timeline,
}) {
  const tabs = [
    call && { label: "Call", content: call },
    business && { label: "Business", content: business },
    metadata && { label: "Metadata", content: metadata },
    timeline && { label: "Timeline", content: timeline },
  ].filter(Boolean);

  const [activeTabLabel, setActiveTabLabel] = useState(
    defaultActiveTabLabel || tabs[0].label,
  );

  return (
    <Tabs
      activeTabLabel={activeTabLabel}
      onTabClick={(tab) => setActiveTabLabel(tab.label)}
      tabs={tabs}
    />
  );
}
