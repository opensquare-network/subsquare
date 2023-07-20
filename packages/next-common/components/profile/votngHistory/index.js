import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { useState } from "react";
import { Democracy, OpenGov } from "./moduleTab";
import { useChain } from "next-common/context/chain";
import { isKintsugiChain } from "next-common/utils/chain";

export default function VotingHistory() {
  const chain = useChain();
  const isKintsugi = isKintsugiChain(chain);
  const [moduleTabIndex, setModuleTabIndex] = useState(
    isKintsugi ? Democracy : OpenGov,
  );

  return (
    <div className="flex flex-col gap-[18px]">
      <VotingHistorySummary
        isKintsugi={isKintsugi}
        moduleTabIndex={moduleTabIndex}
        setModuleTabIndex={setModuleTabIndex}
      />
      <ListTabs moduleTabIndex={moduleTabIndex} />
    </div>
  );
}
