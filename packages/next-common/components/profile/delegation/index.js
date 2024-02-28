import { useChainSettings } from "next-common/context/chain";
import {
  Democracy,
  ModuleTabProvider,
  Referenda,
} from "../votingHistory/common";
import ListTabs from "./listTabs";

export default function Delegation() {
  const { hasReferenda, noDemocracy } = useChainSettings();

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: Referenda });
  }
  if (!noDemocracy) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  let defaultTab = Democracy;
  if (hasReferenda) {
    defaultTab = Referenda;
  }

  return (
    <ModuleTabProvider availableTabs={availableTabs} defaultTab={defaultTab}>
      <div className="flex flex-col gap-[18px]">
        <ListTabs />
      </div>
    </ModuleTabProvider>
  );
}
