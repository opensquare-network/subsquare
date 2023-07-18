import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { useState } from "react";
import { OpenGov } from "./moduleTab";

export default function VotingHistory() {
  const [moduleTabIndex, setModuleTabIndex] = useState(OpenGov);

  return (
    <div className="flex flex-col gap-[18px]">
      <VotingHistorySummary
        moduleTabIndex={moduleTabIndex}
        setModuleTabIndex={setModuleTabIndex}
      />
      <ListTabs moduleTabIndex={moduleTabIndex} />
    </div>
  );
}
