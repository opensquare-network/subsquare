import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import DemocracyDelegatee from "./delegatee";
import DemocracyDelegator from "./delegator";
import PageTabs from "next-common/components/pageTabs";
import DemocracySummary from "./summary";
import { Header, Wrapper } from "../styled";

export default function DemocracyStatistics({
  apiRoot,
  delegatee,
  delegators,
  summary,
}) {
  const tabs = [
    {
      name: "Delegatee",
      content: <DemocracyDelegatee apiRoot={apiRoot} delegatee={delegatee} />,
    },
    {
      name: "Delegator",
      content: <DemocracyDelegator apiRoot={apiRoot} delegators={delegators} />,
    },
  ];

  return (
    <Wrapper>
      <Header>Delegation</Header>
      <Divider />
      <DemocracySummary summary={summary} />
      <Divider />
      <PageTabs tabs={tabs} />
    </Wrapper>
  );
}
