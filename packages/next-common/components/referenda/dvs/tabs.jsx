import TabsList from "next-common/components/tabs/list";
import { useMemo } from "react";
import CurrentCohorts from "./currentCohorts";
import CohortsHistory from "./cohortsHistory";
import { TabTitle } from "./common/delegatesTabTitle";
import { usePageProps } from "next-common/context/page";
import { useSearchParams } from "next/navigation";

const TABS = {
  DELEGATES: "delegates",
  COHORTS_HISTORY: "history",
};

export default function ReferendaDVsTabs() {
  const { cohortsCount } = usePageProps();
  const { cohort } = usePageProps();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");
  const activeTabValue = tab || TABS.DELEGATES;

  const delegatesCount = cohort?.delegateCnt || 0;

  const tabsListItems = useMemo(() => {
    return [
      {
        value: TABS.DELEGATES,
        url: "/referenda/dvs",
        shallow: true,
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
        url: "/referenda/dvs?tab=history",
        shallow: true,
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
        className="mx-6"
      />

      {activeTabValue === TABS.DELEGATES && <CurrentCohorts />}
      {activeTabValue === TABS.COHORTS_HISTORY && <CohortsHistory />}
    </div>
  );
}
