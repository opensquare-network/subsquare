import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import PageTabs from "next-common/components/pageTabs";
import VoteTrendChart from "./voteTrendChart";
import TrackReferendumSummary from "./summary";
import AddressTrendChart from "./addressTrendChart";
import DelegatedCheckBox from "./delegatedCheckBox";
import CheckAllCheckBox from "./checkAllCheckBox";
import Flex from "next-common/components/styled/flex";
import { Header, Wrapper } from "../styled";

export default function AllVotesStatistics({ turnout }) {
  const [delegatedChecked, setDelegatedChecked] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(true);

  const voteTrendChartWidth = (turnout?.length || 0) * 18;
  const addressTrendChartWidth = (turnout?.length || 0) * 10;

  const extra = (
    <Flex style={{ gap: 16 }}>
      <CheckAllCheckBox checked={checkAll} setChecked={setCheckAll} />
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
        <VoteTrendChart
          turnout={turnout}
          delegated={delegatedChecked}
          minWidth={checkAll ? 0 : voteTrendChartWidth}
        />
      ),
      extra,
    },
    {
      name: "Addr Trend",
      content: (
        <AddressTrendChart
          turnout={turnout}
          delegated={delegatedChecked}
          minWidth={checkAll ? 0 : addressTrendChartWidth}
        />
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
