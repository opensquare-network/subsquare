import React from "react";
import Content from "../cardContent";
import Summary from "../new";
import { SummaryItem, SummaryItemTitle, SummaryItemWrapper } from "../styled";

export default function OverviewSummary() {
  // TODO: fetch data

  return (
    <Summary description="Due client synergize developing tentative strategic vec pushback.">
      <SummaryItemWrapper>
        <SummaryItem>
          <SummaryItemTitle>Treasury</SummaryItemTitle>
          <Content></Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Council / T.C.</SummaryItemTitle>
          <Content></Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Democracy</SummaryItemTitle>
          <Content></Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Open Gov</SummaryItemTitle>
          <Content></Content>
        </SummaryItem>
      </SummaryItemWrapper>
    </Summary>
  );
}
