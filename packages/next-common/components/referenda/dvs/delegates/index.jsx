import TabsList from "next-common/components/tabs/list";
import { useMemo, useState } from "react";
import Delegates from "./delegates";
import CohortsHistory from "./cohortsHistory";
import { TabTitle } from "../common/delegatesTabTitle";
import { usePageProps } from "next-common/context/page";

const TABS = {
  DELEGATES: "delegates",
  COHORTS_HISTORY: "cohorts-history",
};

export default function ReferendaDVsDelegatesContainer() {
  const [activeTabValue, setActiveTabValue] = useState(TABS.DELEGATES);
  const { cohortsCount } = usePageProps();
  const { cohort } = usePageProps();

  const delegatesCount = cohort?.delegateCnt || 0;

  const tabsListItems = useMemo(() => {
    return [
      {
        value: TABS.DELEGATES,
        label() {
          return (
            <TabTitle
              label="Delegates"
              length={delegatesCount}
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
              length={cohortsCount}
              disabled={activeTabValue !== TABS.COHORTS_HISTORY}
            />
          );
        },
      },
    ];
  }, [activeTabValue, cohortsCount, delegatesCount]);

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
