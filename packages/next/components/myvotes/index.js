import {
  Democracy,
  ModuleTab,
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";
import ModuleVotes from "./moduleVotes";
import { cn } from "next-common/utils";
import AccountSubTabs from "next-common/components/overview/account/subTabs";

function MyVoteLayout({ children }) {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();

  const hasDemocracyModule = democracy && !democracy?.archived;

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: Referenda });
  }
  if (hasDemocracyModule) {
    availableTabs.push({ tabId: Democracy, tabTitle: Democracy });
  }

  let defaultTab;
  if (hasReferenda) {
    defaultTab = Referenda;
  } else {
    defaultTab = Democracy;
  }

  return (
    <ModuleTabProvider availableTabs={availableTabs} defaultTab={defaultTab}>
      <div className="flex flex-col gap-[16px]">
        <div
          className={cn(
            "flex justify-between items-center gap-3 mx-6",
            "max-sm:block max-sm:space-y-3",
          )}
        >
          <AccountSubTabs />
          <ModuleTab />
        </div>
        {children}
      </div>
    </ModuleTabProvider>
  );
}

export default function MyVotes() {
  return (
    <div>
      <MyVoteLayout>
        <ModuleVotes />
      </MyVoteLayout>
    </div>
  );
}
