import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Tabs from "next-common/components/tabs";
import { useMemo, useState } from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";
import { usePriceType } from "../context/projectProvider";
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
  const { priceType } = usePriceType();

  const proposalsTotal = useMemo(
    () => calcTotalByPriceType(proposals, priceType),
    [proposals, priceType],
  );
  const spendsTotal = useMemo(
    () => calcTotalByPriceType(spends, priceType),
    [spends, priceType],
  );

  return (
    <SummaryLayout>
      <SummaryItem title="Total">
        <ValueDisplay
          value={toPrecision(project[priceType])}
          symbol=""
          prefix="$"
        />
      </SummaryItem>
      <SummaryItem title="Proposals">
        <LoadableContent isLoading={proposalsLoading}>
          <ValueDisplay
            value={toPrecision(proposalsTotal)}
            symbol=""
            prefix="$"
          />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Spends">
        <LoadableContent isLoading={spendsLoading}>
          <ValueDisplay value={toPrecision(spendsTotal)} symbol="" prefix="$" />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

function calcTotalByPriceType(list, priceType) {
  if (!list?.length) {
    return BigNumber(0);
  }
  return list.reduce((acc, item) => {
    const proportion = item.proportion ?? 1;
    const value = BigNumber(item[priceType] ?? 0)
      .times(proportion)
      .toFixed(2);
    return acc.plus(value);
  }, BigNumber(0));
}
