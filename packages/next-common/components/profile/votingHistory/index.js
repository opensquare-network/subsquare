import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { useState } from "react";
import { Democracy, Referenda } from "./common";
import { useChainSettings } from "next-common/context/chain";

export default function VotingHistory() {
  const { hasReferenda } = useChainSettings();
  const [moduleTabIndex, setModuleTabIndex] = useState(
    hasReferenda ? Referenda : Democracy,
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
