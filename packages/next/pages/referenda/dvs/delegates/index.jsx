import TabsList from "next-common/components/tabs/list";
import { useMemo, useState } from "react";
import Delegates from "./delegates";
import CohortsHistory from "./cohortsHistory";
import { TabTitle } from "../common/delegatesTabTitle";

const TABS = {
  DELEGATES: "delegates",
  COHORTS_HISTORY: "cohorts-history",
};

export default function ReferendaDVsDelegatesContainer() {
  const [activeTabValue, setActiveTabValue] = useState(TABS.DELEGATES);

  const tabsListItems = useMemo(() => {
    return [
      {
        value: TABS.DELEGATES,
        label() {
          return (
            <TabTitle
              label="Delegates"
              length={0}
              disabled={activeTabValue !== TABS.DELEGATES}
            />
          );
        },
      },
      {
        value: TABS.COHORTS_HISTORY,
        label() {
          return (
            <TabTitle
              label="Cohorts History"
              length={0}
              disabled={activeTabValue !== TABS.COHORTS_HISTORY}
            />
          );
        },
      },
    ];
  }, [activeTabValue]);

  return (
    <div className="flex flex-col gap-[16px]">
      <TabsList
        tabs={tabsListItems}
        activeTabValue={activeTabValue}
        onTabClick={(tab) => setActiveTabValue(tab.value)}
        className="mx-6"
      />

      {activeTabValue === TABS.DELEGATES && <Delegates />}
      {activeTabValue === TABS.COHORTS_HISTORY && <CohortsHistory />}
    </div>
  );
}
