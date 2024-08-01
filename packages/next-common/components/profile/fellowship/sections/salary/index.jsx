import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import ProfileFellowshipSalarySectionTimeline from "./timeline";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipSalarySectionPayments from "./payments";

export default function ProfileFellowshipSalarySection() {
  const [paymentsCount, setPaymentsCount] = useState();

  const tabs = [
    {
      label: "Payments",
      activeCount: paymentsCount,
      content: (
        <ProfileFellowshipSalarySectionPayments
          setPaymentsCount={setPaymentsCount}
        />
      ),
    },
    {
      label: "Timeline",
      content: <ProfileFellowshipSalarySectionTimeline />,
    },
  ];

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