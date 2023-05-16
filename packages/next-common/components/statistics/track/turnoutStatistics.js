import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import PageTabs from "next-common/components/pageTabs";
import TurnoutPercentageChart from "./turnoutPercentageChart";
import { Header, Wrapper } from "../styled";

export default function TurnoutStatistics({ turnout }) {
  const charts = [
    {
      name: "Turnout Pct.",
      content: <TurnoutPercentageChart turnout={turnout} />,
    },
  ];

  return (
    <Wrapper>
      <Header>Turnout</Header>
      <Divider />
      <PageTabs tabs={charts} />
    </Wrapper>
  );
}
