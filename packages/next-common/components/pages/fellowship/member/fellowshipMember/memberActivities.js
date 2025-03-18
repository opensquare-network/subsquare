import Tabs from "./tabs";
import { useState } from "react";
import CoreActivities from "./coreActivities";
import SalaryActivities from "./salaryActivities";
import ReferendaActivities from "./referendaActivities";

export default function MemberActivities() {
  const [activeTabValue, setActiveTabValue] = useState("salary");
  return (
    <div>
      <div className="mb-[16px]">
        <Tabs
          activeTabValue={activeTabValue}
          setActiveTabValue={setActiveTabValue}
        />
      </div>
      {activeTabValue === "referenda" && <ReferendaActivities />}
      {activeTabValue === "core" && <CoreActivities />}
      {activeTabValue === "salary" && <SalaryActivities />}
    </div>
  );
}
