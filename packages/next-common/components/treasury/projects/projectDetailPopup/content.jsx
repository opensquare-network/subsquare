import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Tabs from "next-common/components/tabs";
import { useMemo, useState } from "react";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import ProjectProposalsList from "./proposalsList";
import ProjectSpendsList from "./spendsList";
import useProposals from "../hooks/useProposals";
import useSpends from "../hooks/useSpends";
import BigNumber from "bignumber.js";
import LoadableContent from "next-common/components/common/loadableContent";

const TAB_VALUES = {
  proposals: "proposals",
  spends: "spends",
};

export default function ProjectContent({ project }) {
  const { proposals: proposalIndexes, spends: spendIndexes } = project;
  const [activeTabId, setActiveTabId] = useState(TAB_VALUES.proposals);
  const { proposals, loading: proposalsLoading } =
    useProposals(proposalIndexes);
  const { spends, loading: spendsLoading } = useSpends(spendIndexes);

  const tabs = useMemo(
    () => [
      {
        value: TAB_VALUES.proposals,
        label: "Proposals",
        activeCount: proposals?.length,
        content: (
          <ProjectProposalsList
            proposals={proposals}
            loading={proposalsLoading}
          />
        ),
      },
      {
        value: TAB_VALUES.spends,
        label: "Spends",
        activeCount: spends?.length,
        content: <ProjectSpendsList spends={spends} loading={spendsLoading} />,
      },
    ],
    [proposals, spends, proposalsLoading, spendsLoading],
  );

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
        onTabClick={(item) => setActiveTabId(item.value)}
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
  const proposalsTotal = useMemo(() => {
    return proposals?.reduce(
      (acc, proposal) => acc.plus(BigNumber(proposal.fiatValue)),
      BigNumber(0),
    );
  }, [proposals]);

  const spendsTotal = useMemo(() => {
    return spends?.reduce(
      (acc, spend) => acc.plus(BigNumber(spend.fiatValue)),
      BigNumber(0),
    );
  }, [spends]);

  return (
    <SummaryLayout>
      <SummaryItem title="Total">
        <ValueDisplay
          value={toPrecision(project.fiatAtFinal)}
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
