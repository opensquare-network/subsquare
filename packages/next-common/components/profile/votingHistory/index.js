import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { Democracy, Fellowship, ModuleTabProvider, Referenda } from "./common";
import { useChainSettings } from "next-common/context/chain";

export default function VotingHistory() {
  const { hasReferenda, hasFellowship } = useChainSettings();

  let defaultTab;
  if (hasReferenda) {
    defaultTab = Referenda;
  } else if (hasFellowship) {
    defaultTab = Fellowship;
  } else {
    defaultTab = Democracy;
  }

  return (
    <ModuleTabProvider defaultTab={defaultTab}>
      <div className="flex flex-col gap-[18px]">
        <VotingHistorySummary />
        <ListTabs />
      </div>
    </ModuleTabProvider>
  );
}
