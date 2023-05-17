import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import PageTabs from "next-common/components/pageTabs";
import VoteTrendChart from "./voteTrendChart";
import TrackReferendumSummary from "./summary";
import AddressTrendChart from "./addressTrendChart";
import DelegatedCheckBox from "./delegatedCheckBox";
import Flex from "next-common/components/styled/flex";
import { Header, Wrapper } from "../styled";

export default function AllVotesStatistics({ turnout }) {
  const [delegatedChecked, setDelegatedChecked] = React.useState(true);

  const extra = (
    <Flex style={{ gap: 16 }}>
      <DelegatedCheckBox
        checked={delegatedChecked}
        setChecked={setDelegatedChecked}
      />
    </Flex>
  );

  const voteCharts = [
    {
      name: "Vote Trend",
      content: (
        <VoteTrendChart turnout={turnout} delegated={delegatedChecked} />
      ),
      extra,
    },
    {
      name: "Addr Trend",
      content: (
        <AddressTrendChart turnout={turnout} delegated={delegatedChecked} />
      ),
      extra,
    },
  ];

  const summary = {
    referendumCount: turnout?.length || 0,
  };

  return (
    <Wrapper>
      <Header>All Vote</Header>
      <Divider />
      <TrackReferendumSummary summary={summary} />
      <Divider />
      <PageTabs tabs={voteCharts} />
    </Wrapper>
  );
}
