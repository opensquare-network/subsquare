import Tabs, { TabItems } from "./tabs";
import { useState } from "react";
import CoreActivities from "./coreActivities";
import SalaryActivities from "./salaryActivities";
import ReferendaActivities from "./referendaActivities";

export default function MemberActivities({ address }) {
  const [activeTabValue, setActiveTabValue] = useState(TabItems.Salary);
  return (
    <div>
      <div className="mb-[16px]">
        <Tabs
          activeTabValue={activeTabValue}
          setActiveTabValue={setActiveTabValue}
        />
      </div>
      {activeTabValue === TabItems.Referenda && (
        <ReferendaActivities address={address} />
      )}
      {activeTabValue === TabItems.Core && <CoreActivities />}
      {activeTabValue === TabItems.Salary && <SalaryActivities />}
    </div>
  );
}
