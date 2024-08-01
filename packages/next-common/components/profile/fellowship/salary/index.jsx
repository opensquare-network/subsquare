import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import ProfileFellowshipSalaryPayments from "./payments";
import ProfileFellowshipSalaryTimeline from "./timeline";

export default function ProfileFellowshipSalary() {
  const [paymentsCount, setPaymentsCount] = useState();

  const tabs = [
    {
      label: "Payments",
      activeCount: paymentsCount,
      content: (
        <ProfileFellowshipSalaryPayments setPaymentsCount={setPaymentsCount} />
      ),
    },
    {
      label: "Timeline",
      content: <ProfileFellowshipSalaryTimeline />,
    },
  ];

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
