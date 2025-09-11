import { useState } from "react";
import DemocracyDelegatee from "./delegatee";
import DemocracyDelegator from "./delegator";
import DemocracySummary from "./summary";
import { Wrapper } from "../styled";
import Tabs from "next-common/components/tabs";

export default function DemocracyStatistics({
  apiRoot,
  delegatee,
  delegators,
  summary,
}) {
  const tabs = [
    {
      value: "delegatee",
      label: "Delegatee",
      content: <DemocracyDelegatee apiRoot={apiRoot} delegatee={delegatee} />,
    },
    {
      value: "delegator",
      label: "Delegator",
      content: <DemocracyDelegator apiRoot={apiRoot} delegators={delegators} />,
    },
  ];

  const [activeTabValue, setActiveTabValue] = useState(tabs[0].value);

  return (
    <div className="space-y-4">
      <Wrapper>
        <DemocracySummary summary={summary} />
      </Wrapper>

      <Wrapper>
        <Tabs
          tabs={tabs}
          activeTabValue={activeTabValue}
          onTabClick={(tab) => {
            setActiveTabValue(tab.value);
          }}
        />
      </Wrapper>
    </div>
  );
}
