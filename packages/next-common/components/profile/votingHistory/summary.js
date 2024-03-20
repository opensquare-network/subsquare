import { useEffect, useState } from "react";
import Summary from "next-common/components/summary";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "./styled";
import { ModuleTab, useAvailableModuleTabs, useModuleName } from "./common";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

function TextSummaryContent({ value }) {
  return <div>{value}</div>;
}

export default function VotingHistorySummary() {
  const { id } = usePageProps();
  const [data, setData] = useState({});
  const { useVoteCall } = useChainSettings();
  const module = useModuleName();
  const availableTabs = useAvailableModuleTabs();

  useEffect(() => {
    nextApi.fetch(`users/${id}/${module}/vote-stats`).then(({ result }) => {
      if (result) {
        setData(result);
      }
    });
  }, [id, module]);

  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={data?.totalVotes || 0} />,
    },
    useVoteCall
      ? {
          title: "All Calls",
          content: <CountSummaryContent count={data?.totalCalls || 0} />,
        }
      : null,
    {
      title: "Participation Rate",
      content: (
        <TextSummaryContent
          value={`${((data?.participationRate || 0) * 100).toFixed(1)}%`}
        />
      ),
    },
  ].filter(Boolean);

  return (
    <>
      {availableTabs?.length > 1 && (
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <Title>Votes</Title>
          <ModuleTab />
        </div>
      )}
      <SecondaryCard>
        <Summary items={items} />
      </SecondaryCard>
    </>
  );
}
