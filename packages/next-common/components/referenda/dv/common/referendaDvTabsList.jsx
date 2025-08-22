import TabsList from "next-common/components/tabs/list";
import { TabTitle } from "./delegatesTabTitle";
import { useMemo } from "react";
import { usePageProps } from "next-common/context/page";
import { useSearchParams } from "next/navigation";

export const TABS = {
  DELEGATES: "delegates",
  COHORTS: "cohorts",
};

export default function ReferendaDvTabsList() {
  const { cohortsCount, cohort } = usePageProps();
  const delegatesCount = cohort?.delegateCnt || 0;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || TABS.DELEGATES;

  const tabsListItems = useMemo(() => {
    return [
      {
        value: TABS.DELEGATES,
        url: "/referenda/dv",
        shallow: true,
        label() {
          return (
            <TabTitle
              label="Delegates"
              length={delegatesCount}
              active={tab === TABS.DELEGATES}
            />
          );
        },
      },
      {
        value: TABS.COHORTS,
        url: "/referenda/dv?tab=cohorts",
        shallow: true,
        label() {
          return (
            <TabTitle
              label="Cohorts"
              length={cohortsCount}
              active={tab === TABS.COHORTS}
            />
          );
        },
      },
    ];
  }, [tab, cohortsCount, delegatesCount]);

  return <TabsList tabs={tabsListItems} activeTabValue={tab} />;
}
