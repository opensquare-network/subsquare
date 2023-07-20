import React, { useEffect, useState } from "react";
import SummaryItems from "next-common/components/summary/summaryItems";
import styled from "styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "./styled";
import ModuleTab, { OpenGov } from "./moduleTab";
import nextApi from "next-common/services/nextApi";
import { usePageProps } from "next-common/context/page";

const ValueWrapper = styled.div`
  .value-display-symbol {
    color: var(--textTertiary);
  }
`;

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

function TextSummaryContent({ value }) {
  return <ValueWrapper>{value}</ValueWrapper>;
}

export default function VotingHistorySummary({
  isKintsugi,
  moduleTabIndex,
  setModuleTabIndex,
}) {
  const { id } = usePageProps();
  const [data, setData] = useState({});

  useEffect(() => {
    const module = moduleTabIndex === OpenGov ? "referenda" : "democracy";
    nextApi.fetch(`users/${id}/${module}/vote-stats`).then(({ result }) => {
      if (result) {
        setData(result);
      }
    });
  }, [id, moduleTabIndex]);

  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={data?.totalVotes || 0} />,
    },
    {
      title: "All Calls",
      content: <CountSummaryContent count={data?.totalCalls || 0} />,
    },
    {
      title: "Participation Rate",
      content: (
        <TextSummaryContent
          value={`${((data?.participationRate || 0) * 100).toFixed(1)}%`}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>Votes</Title>
        {!isKintsugi && (
          <ModuleTab
            moduleTabIndex={moduleTabIndex}
            setModuleTabIndex={setModuleTabIndex}
          />
        )}
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
