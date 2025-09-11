import { useChainSettings } from "next-common/context/chain";
import {
  Democracy,
  ModuleTabProvider,
  Referenda,
} from "../votingHistory/common";

export default function PalletTabs({ shallow, children, defaultTab }) {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: "OpenGov" });
  }
  if (hasDemocracyModule) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  return (
    <ModuleTabProvider
      shallow={shallow}
      availableTabs={availableTabs}
      defaultTab={defaultTab || availableTabs[0]?.tabId}
    >
      <div className="flex flex-col gap-[18px]">{children}</div>
    </ModuleTabProvider>
  );
}
