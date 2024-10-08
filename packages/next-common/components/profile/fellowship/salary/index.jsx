import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import ProfileFellowshipSalaryPayments from "./payments";
import ProfileFellowshipSalaryTimeline from "./timeline";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import ProfileFellowshipStatisticsInfo from "../statisticsInfo";

export default function ProfileFellowshipSalary() {
  const { section } = useCollectivesContext();

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
      <div className="space-y-4">
        <ProfileFellowshipMemberInfo section={section} />
        <ProfileFellowshipStatisticsInfo section={section} />
      </div>

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
