import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Tabs from "next-common/components/tabs";
import { useMemo, useState } from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import usePopupDetailTabs, { TAB_VALUES } from "../hooks/usePopupDetailTabs";

export default function ProjectContent({ project }) {
  const {
    proposals: proposalList,
    spends: spendList,
    childBounties: childBountyList = [],
  } = project;
  const [activeTabId, setActiveTabId] = useState(TAB_VALUES.spends);
  const {
    tabs,
    proposals,
    spends,
    proposalsLoading,
    spendsLoading,
    childBounties,
    childBountiesLoading,
  } = usePopupDetailTabs({ proposalList, spendList, childBountyList });

  return (
    <>
      <ProjectSummary
        project={project}
        spends={spends}
        proposals={proposals}
        proposalsLoading={proposalsLoading}
        spendsLoading={spendsLoading}
        childBounties={childBounties}
        childBountiesLoading={childBountiesLoading}
      />
      <Tabs
        tabs={tabs}
        activeTabValue={activeTabId}
        onTabClick={(tab) => setActiveTabId(tab.value)}
      />
    </>
  );
}

function ProjectSummary({
  project,
  proposals,
  spends,
  proposalsLoading,
  spendsLoading,
  childBounties,
  childBountiesLoading,
}) {
  const proposalsTotal = useMemo(() => calcTotal(proposals), [proposals]);
  const spendsTotal = useMemo(() => calcTotal(spends), [spends]);
  const childBountiesTotal = useMemo(
    () => calcTotal(childBounties),
    [childBounties],
  );

  const summaryItems = [
    {
      title: "Total",
      value: project.fiatAtFinal,
      loading: false,
    },
    {
      title: "Spends",
      value: spendsTotal,
      loading: spendsLoading,
    },
    {
      title: "Proposals",
      value: proposalsTotal,
      loading: proposalsLoading,
    },
    {
      title: "Child Bounties",
      value: childBountiesTotal,
      loading: childBountiesLoading,
    },
  ];

  return (
    <SummaryLayout>
      {summaryItems.map(({ title, value, loading }) => (
        <SummaryItem
          key={title}
          title={title}
          className="[&>div>div:last-child]:flex"
        >
          {loading ? (
            <LoadableContent isLoading={loading}>
              <ValueDisplay value={toPrecision(value)} symbol="" prefix="$" />
            </LoadableContent>
          ) : (
            <ValueDisplay value={toPrecision(value)} symbol="" prefix="$" />
          )}
        </SummaryItem>
      ))}
    </SummaryLayout>
  );
}

function calcTotal(list) {
  if (!list?.length) {
    return BigNumber(0);
  }
  return list.reduce((acc, item) => {
    const proportion = item.proportion ?? 1;
    const value = BigNumber(item.fiatAtFinal ?? 0)
      .times(proportion)
      .toFixed(2);
    return acc.plus(value);
  }, BigNumber(0));
}
