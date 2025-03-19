import Tabs, { TabItems } from "./tabs";
import { useState } from "react";
import CoreActivities from "./coreActivities";
import SalaryActivities from "./salaryActivities";
import ReferendaActivities from "./referendaActivities";

export default function MemberActivities() {
  const [activeTabValue, setActiveTabValue] = useState(TabItems.Referenda);
  return (
    <div>
      <div className="mb-[16px]">
        <Tabs
          activeTabValue={activeTabValue}
          setActiveTabValue={setActiveTabValue}
        />
      </div>
      {activeTabValue === TabItems.Referenda && <ReferendaActivities />}
      {activeTabValue === TabItems.Core && <CoreActivities />}
      {activeTabValue === TabItems.Salary && <SalaryActivities />}
    </div>
  );
}
