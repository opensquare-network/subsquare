import React from "react";
import { SummaryGreyText } from "next-common/components/summary/styled";
import Summary from "./summaryBase";

function ProposalSummaryContent({ summary }) {
  return (
    <span>
      {summary.publicProposals?.active || 0}
      <SummaryGreyText> / {summary.publicProposals?.all || 0}</SummaryGreyText>
    </span>
  );
}

function ReferendaSummaryContent({ summary }) {
  return (
    <span>
      {summary.referenda?.active || 0}
      <SummaryGreyText> / {summary.referenda?.all || 0}</SummaryGreyText>
    </span>
  );
}

export default function DemocracySummaryKusama({ summary }) {
  const items = [
    {
      title: "Proposals",
      content: <ProposalSummaryContent summary={summary} />,
    },
    {
      title: "Referenda",
      content: <ReferendaSummaryContent summary={summary} />,
    },
  ];

  return (
    <Summary
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      items={items}
    />
  );
}
