import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";
import styled from "styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "./styled";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { ModuleTab } from "next-common/components/profile/votingHistory/common";

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

export default function Summary({ votes }) {
  const { symbol } = useChainSettings();
  console.log("votes", votes);
  // const totalBalance = sumVoteBalance(votes);
  // const totalValue = toPrecision(totalBalance, decimals);
  const { hasReferenda, noDemocracyModule } = useChainSettings();

  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={votes?.length || 0} />,
    },
    {
      title: "Total",
      content: (
        <TextSummaryContent
          value={<ValueDisplay value={1} symbol={symbol} />}
        />
      ),
    },
    {
      title: "Unlockable",
      content: (
        <TextSummaryContent
          value={<ValueDisplay value={0} symbol={symbol} />}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>My Votes</Title>
        {hasReferenda && !noDemocracyModule && <ModuleTab />}
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
