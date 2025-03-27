import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipMemberInfo from "../memberInfo";
import ProfileFellowshipModuleTabs from "../moduleTabs";
import ProfileFellowshipSalaryPayments from "./payments";
import ProfileFellowshipSalaryFeeds from "./feeds";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import ProfileFellowshipStatisticsInfo from "../statisticsInfo";

export function FellowshipSalaryCard() {
  const [paymentsCount, setPaymentsCount] = useState();

  const tabs = [
    {
      label: "Payments",
      value: "payments",
      activeCount: paymentsCount,
      content: (
        <ProfileFellowshipSalaryPayments setPaymentsCount={setPaymentsCount} />
      ),
    },
    {
      label: "Feeds",
      value: "feeds",
      content: <ProfileFellowshipSalaryFeeds />,
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <Tabs
      tabs={tabs}
      activeTabValue={activeTabValue}
      onTabClick={(tab) => {
        setActiveTabValue(tab.value);
      }}
    />
  );
}

export default function ProfileFellowshipSalary() {
  const { section } = useCollectivesContext();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ProfileFellowshipMemberInfo section={section} />
        <ProfileFellowshipStatisticsInfo section={section} />
      </div>

      <div className="space-y-4">
        <ProfileFellowshipModuleTabs />

        <NeutralPanel className="p-6">
          <FellowshipSalaryCard />
        </NeutralPanel>
      </div>
    </div>
  );
}
