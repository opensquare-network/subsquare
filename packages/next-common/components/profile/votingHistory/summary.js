import { useEffect, useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "./styled";
import {
  ModuleTab,
  useAvailableModuleTabs,
  useModuleName,
  useIsFellowship,
} from "./common";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

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
  const isFellowship = useIsFellowship();

  useEffect(() => {
    nextApi.fetch(`users/${id}/${module}/vote-stats`).then(({ result }) => {
      if (result) {
        setData(result);
      }
    });
  }, [id, module]);

  return (
    <>
      {availableTabs?.length > 1 && (
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-[12px]">
          <Title>Votes</Title>
          <ModuleTab />
        </div>
      )}
      <SecondaryCard>
        <SummaryLayout>
          <SummaryItem title="All Votes">
            <CountSummaryContent count={data?.totalVotes || 0} />
          </SummaryItem>
          {useVoteCall ? (
            <SummaryItem title="All Calls">
              <CountSummaryContent count={data?.totalCalls || 0} />
            </SummaryItem>
          ) : null}
          {!isFellowship && (
            <SummaryItem title="Participation Rate">
              <TextSummaryContent
                value={`${((data?.participationRate || 0) * 100).toFixed(1)}%`}
              />
            </SummaryItem>
          )}
        </SummaryLayout>
      </SecondaryCard>
    </>
  );
}
