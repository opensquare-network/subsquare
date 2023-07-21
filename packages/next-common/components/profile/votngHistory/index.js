import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { useState } from "react";
import { Democracy, OpenGov } from "./moduleTab";
import { useChainSettings } from "next-common/context/chain";

export default function VotingHistory() {
  const { hasReferenda, hasFellowship } = useChainSettings();
  const hasGov2 = hasReferenda || hasFellowship;
  const [moduleTabIndex, setModuleTabIndex] = useState(
    hasGov2 ? OpenGov : Democracy,
  );

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
