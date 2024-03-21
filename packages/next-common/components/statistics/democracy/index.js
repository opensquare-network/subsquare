import React from "react";
import DemocracyDelegatee from "./delegatee";
import DemocracyDelegator from "./delegator";
import PageTabs from "next-common/components/pageTabs";
import DemocracySummary from "./summary";
import { Wrapper } from "../styled";

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
    <div className="space-y-4">
      <Wrapper>
        <DemocracySummary summary={summary} />
      </Wrapper>

      <Wrapper>
        <PageTabs tabs={tabs} />
      </Wrapper>
    </div>
  );
}
