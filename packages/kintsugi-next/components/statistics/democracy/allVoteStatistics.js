import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import PageTabs from "next-common/components/pageTabs";
import VoteTrendChart from "./voteTrendChart";
import ReferendumSummary from "next-common/components/statistics/track/summary";
import AddressTrendChart from "./addressTrendChart";
import { Header, Wrapper } from "next-common/components/statistics/styled";

export default function AllVotesStatistics({ turnout }) {
  const voteCharts = [
    {
      name: "Vote Trend",
      content: (
        <VoteTrendChart turnout={turnout} />
      ),
    },
    {
      name: "Addr Trend",
      content: (
        <AddressTrendChart turnout={turnout} />
      ),
    },
  ];

  const summary = {
    referendumCount: turnout?.length || 0,
  };

  return (
    <Wrapper>
      <Header>All Vote</Header>
      <Divider />
      <ReferendumSummary summary={summary} />
      <Divider />
      <PageTabs tabs={voteCharts} />
    </Wrapper>
  );
}
