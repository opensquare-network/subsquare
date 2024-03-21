import { useChainSettings } from "next-common/context/chain";
import {
  Democracy,
  ModuleTabProvider,
  Referenda,
} from "../votingHistory/common";

export default function PalletTabs({ shallow, children }) {
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
    <ModuleTabProvider
      shallow={shallow}
      availableTabs={availableTabs}
      defaultTab={defaultTab}
    >
      <div className="flex flex-col gap-[18px]">{children}</div>
    </ModuleTabProvider>
  );
}
