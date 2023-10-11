import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { Democracy, Fellowship, ModuleTabProvider, Referenda } from "./common";
import { useChainSettings } from "next-common/context/chain";
import { useRouter } from "next/router";

export default function VotingHistory() {
  const { hasReferenda, hasFellowship, noDemocracy } = useChainSettings();
  const router = useRouter();

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

  let defaultTab = router.query.defaultTab;
  if (!defaultTab) {
    if (hasReferenda) {
      defaultTab = Referenda;
    } else if (hasFellowship) {
      defaultTab = Fellowship;
    } else {
      defaultTab = Democracy;
    }
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
