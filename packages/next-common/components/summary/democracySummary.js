import React from "react";
import styled from "styled-components";
import CountDown from "next-common/components/summary/countDown";
import Content from "./cardContent";
import { useChain } from "../../context/chain";
import {
  SummaryGreyText,
  SummaryTitle,
} from "next-common/components/summary/styled";
import Chains from "../../utils/consts/chains";
import SummaryNextLaunchTime from "./nextLaunchTime";
import Summary from "./summaryBase";
import { useDemocracySummaryData } from "../../hooks/useDemoracySummaryData";

const LaunchPeriod = styled.div`
  display: flex;
  gap: 16px;
`;

function LaunchPeriodContent({ summary }) {
  return (
    <LaunchPeriod>
      <div>
        <SummaryTitle>Launch Period</SummaryTitle>
        <Content>
          {(summary?.launchPeriod || []).map((item, index) => (
            <span className={index % 2 === 1 ? "unit" : ""} key={index}>
              {item}
            </span>
          ))}
          {(summary?.totalPeriod || []).map((item, index) => (
            <span
              className={index % 2 === 1 ? "unit total" : "total"}
              key={index}
            >
              {item}
            </span>
          ))}
        </Content>
      </div>

      <div>
        <CountDown percent={summary?.progress ?? 0} />
      </div>
    </LaunchPeriod>
  );
}

function ProposalSummaryContent({ summary }) {
  return (
    <span>
      {summary.activeProposalsCount || 0}
      <SummaryGreyText> / {summary.publicPropCount || 0}</SummaryGreyText>
    </span>
  );
}

function ReferendaSummaryContent({ summary }) {
  return (
    <span>
      {summary.referendumCount || 0}
      <SummaryGreyText> / {summary.referendumTotal || 0}</SummaryGreyText>
    </span>
  );
}

export default function DemocracySummary({ footer }) {
  const chain = useChain();
  const summary = useDemocracySummaryData();
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);

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

  if (isKintsugi) {
    items.push({
      content: (
        <SummaryNextLaunchTime
          key="next-launch-time"
          nextLaunchTimestamp={summary.nextLaunchTimestamp}
        />
      ),
    });
  } else {
    items.push({
      content: <LaunchPeriodContent summary={summary} />,
    });
  }

  return (
    <Summary
      description="Democracy uses public proposal, external proposal and referenda to mange the governance process."
      items={items}
      footer={footer}
    />
  );
}
