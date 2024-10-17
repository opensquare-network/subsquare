import PageTabs from "next-common/components/pageTabs";
import { useChainSettings } from "next-common/context/chain";
import ResponsiveVotes from "./responsiveVotes";
import ResponsiveCalls from "./responsiveCalls";
import {
  defaultFilterValues,
  democracyVoteOptions,
  fellowshipVoteOptions,
  referendaVoteOptions,
  VoteFilter,
} from "./voteFilter";
import { DropdownFilterProvider } from "next-common/components/dropdownFilter/context";
import { Democracy, Fellowship, Referenda, useModuleTab } from "./common";

function useVoteFilter() {
  const selectedTabId = useModuleTab();
  if (selectedTabId === Referenda) {
    return <VoteFilter options={referendaVoteOptions} />;
  } else if (selectedTabId === Fellowship) {
    return <VoteFilter options={fellowshipVoteOptions} />;
  } else if (selectedTabId === Democracy) {
    return <VoteFilter options={democracyVoteOptions} />;
  }

  return null;
}

export default function ListTabs() {
  const { useVoteCall } = useChainSettings();
  const voteFilter = useVoteFilter();

  return (
    <div className="ml-[24px]">
      <DropdownFilterProvider defaultFilterValues={defaultFilterValues}>
        <PageTabs
          tabs={[
            {
              name: "All Votes",
              content: <ResponsiveVotes />,
              extra: voteFilter,
            },
            useVoteCall
              ? {
                  name: "Calls",
                  content: <ResponsiveCalls />,
                }
              : null,
          ].filter(Boolean)}
        />
      </DropdownFilterProvider>
    </div>
  );
}
