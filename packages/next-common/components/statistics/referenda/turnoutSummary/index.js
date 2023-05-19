import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import { Header, Wrapper } from "../../styled";
import TurnoutChart from "./turnoutChart";

export default function OpenGovTurnoutSummary({ summary }) {
  return (
    <Wrapper>
      <Header>Turnout</Header>
      <Divider />
      <Header>Average Turnout Pct.</Header>
      <TurnoutChart turnouts={summary?.trackTurnouts} />
    </Wrapper>
  );
}
