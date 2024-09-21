import { withCommonProps } from "next-common/lib";
import AccountLayout from "next-common/components/layout/AccountLayout";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import {
  Democracy,
  ModuleTab,
  ModuleTabProvider,
  Referenda,
} from "next-common/components/profile/votingHistory/common";
import { useChainSettings } from "next-common/context/chain";
import { cn } from "next-common/utils";
import AccountSubTabs from "next-common/components/overview/account/subTabs";
import ModuleVotes from "components/myvotes/moduleVotes";

function MyVoteLayout({ children }) {
  const {
    modules: { referenda: hasReferenda, democracy },
  } = useChainSettings();

  const hasDemocracy = democracy && !democracy?.archived;

  const availableTabs = [];
  if (hasReferenda) {
    availableTabs.push({ tabId: Referenda, tabTitle: Referenda });
  }
  if (hasDemocracy) {
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

export default function AccountVotesPage() {
  return (
    <AccountLayout>
      <MyVoteLayout>
        <ModuleVotes />
      </MyVoteLayout>
    </AccountLayout>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      summary: tracksProps.summary,
      ...tracksProps,
    },
  };
});
