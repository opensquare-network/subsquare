import { useChainSettings } from "next-common/context/chain";
import {
  Democracy,
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import ListTabs from "./listTabs";

export default function MyDelegation() {
  const { hasReferenda, noDemocracyModule } = useChainSettings();

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: "OpenGov" });
  }
  if (!noDemocracyModule) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  const defaultTab = availableTabs[0]?.tabId;

  return (
    <ModuleTabProvider availableTabs={availableTabs} defaultTab={defaultTab}>
      <div className="flex flex-col gap-[18px]">
        <ListTabs />
      </div>
    </ModuleTabProvider>
  );
}
