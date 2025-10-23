import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import ProfileFellowshipSalaryPayments from "./payments";
import ProfileFellowshipSalaryFeeds from "./feeds";

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
  return (
    <NeutralPanel className="p-6">
      <FellowshipSalaryCard />
    </NeutralPanel>
  );
}
