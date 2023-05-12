import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import styled from "styled-components";
import PageTabs from "next-common/components/pageTabs";
import TurnoutPercentageChart from "./turnoutPercentageChart";
import VoteTrendChart from "./voteTrendChart";
import TrackReferendumSummary from "./summary";
import AddressTrendChart from "./addressTrendChart";
import DelegatedCheckBox from "./delegatedCheckBox";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
  }
  gap: 16px;

  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey200Border};
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 8px;

  margin-top: 16px;
`;

const Header = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  color: ${(p) => p.theme.textPrimary};
`;

export default function TrackStatistics({ turnout }) {
  const [delegatedChecked, setDelegatedChecked] = React.useState(true);

  const voteCharts = [
    {
      name: "Vote Trend",
      content: (
        <VoteTrendChart turnout={turnout} delegated={delegatedChecked} />
      ),
      extra: (
        <DelegatedCheckBox
          checked={delegatedChecked}
          setChecked={setDelegatedChecked}
        />
      ),
    },
    {
      name: "Addr Trend",
      content: <AddressTrendChart turnout={turnout} />,
    },
  ];

  const charts = [
    {
      name: "Turnout Pct.",
      content: <TurnoutPercentageChart turnout={turnout} />,
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
      <Header>Turnout</Header>
      <Divider />
      <PageTabs tabs={charts} />
    </Wrapper>
  );
}
