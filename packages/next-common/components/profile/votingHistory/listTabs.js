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
import Tabs from "next-common/components/tabs";
import { useState } from "react";
import { cn } from "next-common/utils";

function TabTitle({ active, children }) {
  return (
    <div
      role="button"
      className={cn(
        "text16Bold",
        active ? "text-textPrimary" : "text-textTertiary",
      )}
    >
      {children}
    </div>
  );
}

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

  const tabs = [
    {
      value: "all_votes",
      label({ active }) {
        return <TabTitle active={active}>All Votes</TabTitle>;
      },
      content: <ResponsiveVotes />,
      extra: voteFilter,
    },
    useVoteCall && {
      value: "calls",
      label({ active }) {
        return <TabTitle active={active}>Calls</TabTitle>;
      },
      content: <ResponsiveCalls />,
    },
  ].filter(Boolean);

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <div className="ml-[24px]">
      <DropdownFilterProvider defaultFilterValues={defaultFilterValues}>
        <Tabs
          tabs={tabs}
          activeTabValue={activeTabValue}
          onTabClick={(tab) => {
            setActiveTabValue(tab.value);
          }}
          tabsListDivider={false}
          tabsListClassName="mr-6"
        />
      </DropdownFilterProvider>
    </div>
  );
}
