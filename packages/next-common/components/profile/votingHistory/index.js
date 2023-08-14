import VotingHistorySummary from "./summary";
import ListTabs from "./listTabs";
import { Democracy, ModuleTabProvider, Referenda } from "./common";
import { useChainSettings } from "next-common/context/chain";

export default function VotingHistory() {
  const { hasReferenda } = useChainSettings();
  const defaultTab = hasReferenda ? Referenda : Democracy;

  return (
    <ModuleTabProvider defaultTab={defaultTab}>
      <div className="flex flex-col gap-[18px]">
        <VotingHistorySummary />
        <ListTabs />
      </div>
    </ModuleTabProvider>
  );
}
