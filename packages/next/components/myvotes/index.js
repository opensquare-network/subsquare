import {
  Democracy,
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";
import ModuleVotes from "./moduleVotes";
import AccountInfo from "next-common/components/overview/accountInfo";

export default function MyVotes() {
  const { hasReferenda, noDemocracyModule } = useChainSettings();

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: Referenda });
  }
  if (!noDemocracyModule) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  let defaultTab;
  if (hasReferenda) {
    defaultTab = Referenda;
  } else {
    defaultTab = Democracy;
  }

  return (
    <div className="space-y-6">
      <AccountInfo hideManageAccountLink />

      <ModuleTabProvider availableTabs={availableTabs} defaultTab={defaultTab}>
        <ModuleVotes />
      </ModuleTabProvider>
    </div>
  );
}
