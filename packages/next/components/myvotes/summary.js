import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";
import styled from "styled-components";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { Title } from "./styled";

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
  const items = [
    {
      title: "All Votes",
      content: <CountSummaryContent count={votes?.length || 0} />,
    },
    {
      title: "Unlockable / Total",
      content: <TextSummaryContent value={"0 / 0"} />,
    },
  ];

  return (
    <>
      <div className="flex justify-between md:items-center max-md:flex-col gap-[12px]">
        <Title>My Votes</Title>
      </div>
      <SecondaryCard>
        <SummaryItems items={items} />
      </SecondaryCard>
    </>
  );
}
