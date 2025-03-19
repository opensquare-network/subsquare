import Tabs, { TabItems } from "./tabs";
import { useState } from "react";
import CoreActivities from "./coreActivities";
import SalaryActivities from "./salaryActivities";
import VoteActivities from "./voteActivities";

export default function MemberActivities() {
  const [activeTabValue, setActiveTabValue] = useState(TabItems.Votes);
  return (
    <div>
      <div className="mb-[16px]">
        <Tabs
          activeTabValue={activeTabValue}
          setActiveTabValue={setActiveTabValue}
        />
      </div>
      {activeTabValue === TabItems.Votes && <VoteActivities />}
      {activeTabValue === TabItems.Core && <CoreActivities />}
      {activeTabValue === TabItems.Salary && <SalaryActivities />}
    </div>
  );
}
