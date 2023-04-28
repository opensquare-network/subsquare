import React from "react";
import SummaryItems from "next-common/components/summary/summaryItems";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import styled from "styled-components";

const ValueWrapper = styled.div`
  .value-display-symbol {
    color: ${(p) => p.theme.textTertiary};
  }
`;

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

function ValueSummaryContent({ value }) {
  const { voteSymbol, symbol, decimals } = useChainSettings();
  return (
    <ValueWrapper>
      <ValueDisplay
        value={toPrecision(value || 0, decimals)}
        symbol={voteSymbol || symbol}
      />
    </ValueWrapper>
  );
}

export default function DemocracySummary({ summary }) {
  const items = [
    {
      title: "DELEGATEE",
      content: <CountSummaryContent count={summary?.address.delegatee} />,
    },
    {
      title: "DELEGATOR",
      content: <CountSummaryContent count={summary?.address.delegator} />,
    },
    {
      title: "TOTAL CAPITAL",
      content: <ValueSummaryContent value={summary?.votes.capital} />,
    },
    {
      title: "TOTAL VOTES",
      content: <ValueSummaryContent value={summary?.votes.votes} />,
    },
  ];

  return <SummaryItems items={items} />;
}
