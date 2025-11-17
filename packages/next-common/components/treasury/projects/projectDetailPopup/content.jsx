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
  const { proposals: proposalList, spends: spendList } = project;
  const [activeTabId, setActiveTabId] = useState(TAB_VALUES.proposals);
  const { tabs, proposals, spends, proposalsLoading, spendsLoading } =
    usePopupDetailTabs({ proposalList, spendList });

  return (
    <>
      <ProjectSummary
        project={project}
        spends={spends}
        proposals={proposals}
        proposalsLoading={proposalsLoading}
        spendsLoading={spendsLoading}
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
}) {
  const proposalsTotal = useMemo(() => calcTotal(proposals), [proposals]);
  const spendsTotal = useMemo(() => calcTotal(spends), [spends]);

  return (
    <SummaryLayout>
      <SummaryItem title="Total">
        <ValueDisplay
          value={toPrecision(project.fiatAtFinal)}
          symbol=""
          prefix="$"
        />
      </SummaryItem>
      <SummaryItem title="Proposals" className="[&_div]:flex">
        <LoadableContent isLoading={proposalsLoading}>
          <ValueDisplay
            value={toPrecision(proposalsTotal)}
            symbol=""
            prefix="$"
          />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Spends" className="[&_div]:flex">
        <LoadableContent isLoading={spendsLoading}>
          <ValueDisplay value={toPrecision(spendsTotal)} symbol="" prefix="$" />
        </LoadableContent>
      </SummaryItem>
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
