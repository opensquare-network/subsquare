import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { Democracy, Fellowship, ModuleTabProvider, Referenda } from "./common";
import { useChainSettings } from "next-common/context/chain";

export default function VotingHistory() {
  const { hasReferenda, hasFellowship, noDemocracy } = useChainSettings();

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: Referenda });
  }
  if (hasFellowship) {
    availableTabs.push({ tabId: Fellowship, tabTitle: Fellowship });
  }
  if (!noDemocracy) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  let defaultTab = Democracy;
  if (hasReferenda) {
    defaultTab = Referenda;
  } else if (hasFellowship) {
    defaultTab = Fellowship;
  }

  return (
    <ModuleTabProvider availableTabs={availableTabs} defaultTab={defaultTab}>
      <div className="flex flex-col gap-[18px]">
        <VotingHistorySummary />
        <ListTabs />
      </div>
    </ModuleTabProvider>
  );
}
